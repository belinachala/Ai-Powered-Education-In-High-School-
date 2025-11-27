# users/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication

from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Custom session authentication that exempts CSRF checks.
    Useful for API calls from frontend like React.
    """
    def enforce_csrf(self, request):
        return  # Do not perform CSRF check


# -------------------------
# Register API
# -------------------------
class RegisterView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Login API
# -------------------------
class LoginView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]

            user = authenticate(username=username, password=password)
            if user is None:
                return Response({"message": "Invalid username or password"}, status=status.HTTP_400_BAD_REQUEST)

            # Return user info to frontend
            return Response({
                "success": True,
                "user": {
                    "username": user.username,
                    "role": user.role,
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
