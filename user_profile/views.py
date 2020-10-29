import magic
from django.shortcuts import render, get_object_or_404, HttpResponse, HttpResponseRedirect, reverse, Http404
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib import messages

# Importing token
from .tokens import account_activation_token

from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

# Import for sending mail
from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


from game.models import GameHistory, Participant
from .models import UserProfile

from .forms import AvatarUploadForm

User = get_user_model()


def user_profile_view(request, username):

    visited_user_qs = User.objects.filter(username=username)
    if not visited_user_qs:
        message = f"User with username {username} not found!"
        return render(request, '404.html', {"message": message})

    visitor = request.user
    visited_user = visited_user_qs[0]
    # if visitor.is_authenticated:
    visited_profile = UserProfile.objects.get(user=visited_user)
    avatar_upload_form = AvatarUploadForm()
    context = {
        "visited_user": visited_user,
        "visited_profile": visited_profile,
        "avatar_upload_form": avatar_upload_form,
    }
    return render(request, 'user_profile/profile_new.html', context=context)
    # else:
    #     message = f"Oops! User with username {username} not found!"
    #     return render(request, '404.html', {"message": message})


@login_required
def verify_email(request, username):
    """
        This function sends a verification link to your email.
    """
    requested_user_qs = User.objects.filter(username=username)
    if not requested_user_qs:
        message = f"User with username {username} not found!"
        return render(request, '404.html', {"message": message})

    requested_user = requested_user_qs[0]

    user = request.user
    if user == requested_user:
        email = requested_user.email
        host = request.get_host()
        subject = 'Activate your UNO Game account.'

        email_context = {
            'user': user,
            'host': host,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': account_activation_token.make_token(user),
        }
        html_message = render_to_string('user_profile/mail_template_email_verification.html', context=email_context)
        plain_message = strip_tags(html_message)

        from_email = "noreply@django_unchained"
        to = str(email)
        try:
            mail.send_mail(subject, plain_message, from_email, [to], html_message=html_message)
        except mail.BadHeaderError:
            messages.info(request, f"Invalid Header found, mail not sent!")

        return HttpResponse('Please confirm your email address to complete the registration.')
    message = f"You are not authorised to visit this page."
    return render(request, '404.html', {"message": message})


def activate(request, uidb64, token):
    """
        A function that verifies email through activation link.
    """
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        if request.user == user:
            if user.is_authenticated:
                profile = UserProfile.objects.get(user=user)

                profile.is_email_verified = True
                profile.save()

                messages.success(request, f"Your email has been verified.")
                return HttpResponseRedirect(reverse('home'))
            messages.success(request, f"Login to verify email.")
            return HttpResponseRedirect(reverse('home'))
    return HttpResponse('Activation link is invalid!')


def clean_file(request, form):
    file = form.cleaned_data['avatar']
    if file.size > 5242880:
        return False
    return True


def check_in_memory_mime(request):
    mime = magic.from_buffer(request.FILES.get('avatar').read(), mime=True)
    return mime


@login_required
def avatar_upload(request, username):
    """
        This function uploads/re-uploads profile picture of a user.
    """
    if request.method == 'POST':
        avatar_form = AvatarUploadForm(request.POST, request.FILES)
        print(request.FILES)

        if avatar_form.is_valid():
            # print("Hello")
            user = User.objects.get(username=username)
            user_prof = UserProfile.objects.get(user=user)
            if clean_file(request, avatar_form):
                mime = check_in_memory_mime(request)
                if mime == 'image/jpg' or mime == 'image/jpeg' or mime == 'image/png':
                    img = avatar_form.cleaned_data['avatar']
                    user_prof.avatar = img
                    user_prof.save()
                    messages.success(request, f"Avatar uploaded successfully!")
                    return HttpResponseRedirect(reverse("user_profile", kwargs={'username': username}))
                else:
                    messages.success(request, f"Please upload an Image File only of jpeg/jpg/png format only...")
                    return HttpResponseRedirect(reverse("user_profile", kwargs={'username': username}))
            else:
                messages.success(request, f"File too Large to be uploaded...")
                return HttpResponseRedirect(reverse("user_profile", kwargs={'username': username}))
        else:
            if avatar_form.errors:
                for field in avatar_form:
                    for error in field.errors:
                        print(error)
                        messages.success(request, error)
            return HttpResponseRedirect(reverse("user_profile", kwargs={'username': username}))
    else:
        message = None
        return render(request, '404.html', {"message": message})


@login_required
def history(request, username):
    user = request.user
    visited_user_qs = User.objects.filter(username=username)
    if not visited_user_qs:
        message = f"User with username {username} does'nt exist."
        return render(request, '404.html', {"message": message})

    visited_user = visited_user_qs[0]
    if visited_user.username != user.username:
        message = f"Why are you interested in someone else's history?"
        return render(request, '404.html', {"message": message})

    participant_qs = Participant.objects.filter(user=user)

    public_games = []
    custom_games = []
    for participant in participant_qs:
        game_room = participant.game_room
        if game_room.game_type == GameHistory.PUBLIC:
            public_games.append(game_room)
        elif game_room.game_type == GameHistory.CUSTOM:
            custom_games.append(game_room)

    print("Public Games: ")
    public_game_data = []
    for game in public_games:
        winner = game.winner_username
        concluded_at = game.concluded_at
        unique_id = game.unique_game_id
        print(f"Unique ID: {unique_id}")
        print(f"Concluded at: {concluded_at}")
        player_qs = Participant.objects.filter(game_room=game)
        print(f"Winner: {winner}")
        data = {
            "game": game,
            "participants": player_qs,
        }
        public_game_data.append(data)

    print("Custom Game: ")
    custom_game_data = []
    for game in custom_games:
        winner = game.winner_username
        concluded_at = game.concluded_at
        unique_id = game.unique_game_id
        print(f"Unique ID: {unique_id}")
        print(f"Concluded at: {concluded_at}")
        player_qs = Participant.objects.filter(game_room=game)
        print(f"Winner: {winner}")
        data = {
            "game": game,
            "participants": player_qs,
        }
        custom_game_data.append(data)
        for player in player_qs:
            print(f"{player.user.username} (Score: {player.score}")

    context = {
        "custom_game_data": custom_game_data,
        "public_game_data": public_game_data,
    }
    return render(request, 'user_profile/history.html', context=context)