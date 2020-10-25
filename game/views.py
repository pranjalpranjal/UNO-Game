from django.shortcuts import render, reverse, HttpResponseRedirect, HttpResponse, Http404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import GameRoom, Player
from channels.layers import get_channel_layer
import json
from asgiref.sync import async_to_sync

ERROR = "error"
SUCCESS = "success"
MAX_JOINED_PLAYER_COUNT = 10
MINIMUM_ONLINE_PLAYER_REQUIRED = 2

ACTIVE_GAME_ROOMS = []  # Will contain unique ID of active game rooms.

channel_layer = get_channel_layer()

User = get_user_model()


def broadcast_notification(group_name, message):
    """
        Helper Function to Broadcast Notifications in Game Room.
    :param group_name: Name of Group in which event should be broadcast.
    :param message: Notification Message.
    :return:
    """
    text = {
        "status": "broadcast_notification",
        "message": message,
    }
    group_name = f"game_room_{group_name}"
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "broadcast.notification",
            "text": json.dumps(text)
        }
    )


def play_now(request):
    return render(request, 'game/play_now.html', {})


# TODO: Play Anonymously option for authenticated users as well.
def enter_public_play(request):
    player = request.user
    if player.is_authenticated:
        if ACTIVE_GAME_ROOMS:
            active_unique_id = ACTIVE_GAME_ROOMS[0]
        else:
            admin = User.objects.get(username="admin")
            new_public_game_room = GameRoom.objects.create(admin=admin, type=GameRoom.PUBLIC)
            active_unique_id = new_public_game_room.unique_game_id
            ACTIVE_GAME_ROOMS.append(active_unique_id)
        return HttpResponseRedirect(reverse('join_game_room', kwargs={'unique_id': active_unique_id}))
    else:
        message = f"You need to Login/Signup first."
        raise Http404(message)


def enter_friend_play(request):
    if request.method == "GET":
        unique_id = request.GET['friend_unique_id']
        print(unique_id)
        return HttpResponseRedirect(reverse('enter_game_room', kwargs={"unique_id": unique_id}))


@login_required
def create_game_room(request):
    """
        View to Create Game Room
    :param request:
    :return:
    """
    user = request.user
    if user.is_authenticated:
        # Creating a new GameRoom Object
        new_game_room = GameRoom.objects.create(admin=user, type=GameRoom.FRIEND)

        # Creating a Player Object corresponding to admin
        player_obj = Player.objects.create(player=user, game_room=new_game_room)

        return HttpResponseRedirect(reverse('user_profile', kwargs={'username': user.username}))
    else:
        return HttpResponse(f"Oops! User with username {user.username} not found!")


@login_required
def join_game_room(request, unique_id):
    """
        View to Join Existing Game Room, if not already joined.
    :param request:
    :param unique_id: Unique Game ID of the Game Room
    :return:
    """
    game_room_qs = GameRoom.objects.filter(unique_game_id=unique_id)
    user = request.user

    if not user.is_authenticated:
        error_message = f"Login / Signup to join a Game Room."
        raise Http404(error_message)

    if game_room_qs:

        game_room = game_room_qs[0]
        player_obj = Player.objects.filter(game_room=game_room, player=user)
        if player_obj:
            error_message = f"You are already in this Game Room (Unique ID: {unique_id})."
            raise Http404(error_message)

        # If there are already 10 i.e. maximum players who have joined this Game Room.
        if game_room.joined_player_count == MAX_JOINED_PLAYER_COUNT:
            error_message = f"This Game Room (Unique ID: {unique_id}) has reached it's maximum player limit. You won't be able to join this. "
            raise Http404(error_message)

        # Creating new Player Object if this user has not joined the room
        Player.objects.create(player=user, game_room=game_room)

        try:
            return HttpResponseRedirect(reverse('enter_game_room', kwargs={'unique_id': unique_id}))
        except Http404:
            return HttpResponseRedirect(reverse('user_profile', kwargs={'username': user.username}))
    else:
        error_message = f"Game with unique_id {unique_id} not found."
        raise Http404(error_message)


@login_required
def enter_game_room(request, unique_id):
    """
        View to Enter the Game Room. This can be called only after
        a player has Joined the Game Room.
    :param request:
    :param unique_id:
    :return:
    """
    game_room_qs = GameRoom.objects.filter(unique_game_id=unique_id)
    user = request.user
    if not user.is_authenticated:
        error_message = f"Login / Signup to enter a Game Room."
        raise Http404(error_message)

    if game_room_qs:
        # If Game Room Exists
        game_room = game_room_qs[0]
        all_game_room_players_qs = Player.objects.filter(game_room=game_room)
        players_qs = Player.objects.filter(player=user, game_room=game_room)
        online_player_qs = Player.objects.filter(player=user, is_online=True)

        # If user has already entered into another Game Room
        if online_player_qs and online_player_qs[0].game_room != game_room:
            error_message = f"You are already present in other game rooms. Leave them to join this room."
            raise Http404(error_message)

        # If user has not joined the room but is trying to enter it.
        if not players_qs:
            error_message = "You are not a member of this Room. Join the room and then try to enter."
            raise Http404(error_message)

        # TODO: Uncomment this -- Kshitiz
        # If Game has already started in the Game Room. In this case Player won't be allowed to join it.from
        # if game_room.is_game_running and online_player_qs[0].game_room != game_room:
        #     error_message = f"A Game has started/is running in this Game Room (Unique ID: {unique_id}). Wait for it to end or join another Game Room."
        #     raise Http404(error_message)

        """
            The functionality implemented by below commented code is currently being done in the consumers.py.
            
            # # Setting Player's is_online status to true
            # player = players_qs[0]
            # player.is_online = True
            # player.save()
        """

        context = {
            'game_room': game_room,
            'players': all_game_room_players_qs,
        }
        return render(request, 'game/enter_game_room.html', context)
    else:
        error_message = f"Game with unique_id {unique_id} not found."
        raise Http404(error_message)
