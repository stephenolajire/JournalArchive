from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
import random
from datetime import datetime, timedelta
from django.core.cache import cache

User = get_user_model()

class UserRegistrationAPIView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'message': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            
            # Generate 6 digit OTP
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            print (otp)
            
            # Store OTP in cache with 10 minutes expiry
            cache_key = f'password_reset_otp_{email}'
            cache.set(cache_key, otp, timeout=600)  # 600 seconds = 10 minutes

            # Send email with OTP
            subject = 'Password Reset Verification Code'
            message = f'''
            Hello {user.first_name},

            You requested to reset your password. Here is your verification code:

            {otp}

            This code will expire in 10 minutes.

            If you didn't request this, please ignore this email.

            Best regards,
            JournalArchive Team
            '''
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({
                'message': 'Verification code sent to your email',
                'email': email
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'message': 'No account found with this email'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'message': f'Error sending verification code: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({
                'message': 'Email and OTP are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if user exists
            user = User.objects.get(email=email)

            # Get stored OTP from cache
            cache_key = f'password_reset_otp_{email}'
            stored_otp = cache.get(cache_key)

            if not stored_otp:
                return Response({
                    'message': 'OTP has expired. Please request a new one.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if otp != stored_otp:
                return Response({
                    'message': 'Invalid OTP'
                }, status=status.HTTP_400_BAD_REQUEST)

            # OTP is valid - generate reset token
            reset_token = ''.join(random.choices('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=32))
            
            # Store reset token in cache with 30 minutes expiry
            reset_cache_key = f'password_reset_token_{email}'
            cache.set(reset_cache_key, reset_token, timeout=1800)  # 30 minutes

            # Clear the OTP from cache
            cache.delete(cache_key)

            return Response({
                'message': 'OTP verified successfully',
                'reset_token': reset_token
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'message': 'No account found with this email'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'message': f'Error verifying OTP: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'message': 'Email and new password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate password
            if len(password) < 8:
                return Response({
                    'message': 'Password must be at least 8 characters long'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get user
            user = User.objects.get(email=email)

            # Check if reset token exists and is valid
            reset_cache_key = f'password_reset_token_{email}'
            stored_token = cache.get(reset_cache_key)

            if not stored_token:
                return Response({
                    'message': 'Reset token has expired. Please restart the reset process.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Reset the password
            user.set_password(password)
            user.save()

            # Clear the reset token from cache
            cache.delete(reset_cache_key)

            # Invalidate all existing tokens (optional but recommended)
            # if hasattr(user, 'auth_token'):
            #     user.auth_token.delete()

            return Response({
                'message': 'Password has been reset successfully'
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({
                'message': 'No account found with this email'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'message': f'Error resetting password: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
