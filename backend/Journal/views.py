from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import *
from .serializers import JournalSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

class SubmitJournalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = JournalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"message": "Journal submitted successfully!", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListUserJournalsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        journals = Journal.objects.all()
        serializer = JournalSerializer(journals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_journal(request):
    try:
        journal_id = request.data.get('journal_id')
        journal = Journal.objects.get(id=journal_id)
        
        # Check if already saved
        if SavedJournal.objects.filter(user=request.user, journal=journal).exists():
            return Response(
                {'message': 'Journal already saved'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save the journal
        SavedJournal.objects.create(user=request.user, journal=journal)
        return Response({'message': 'Journal saved successfully'})
        
    except Journal.DoesNotExist:
        return Response(
            {'message': 'Journal not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'message': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unsave_journal(request, journal_id):
    try:
        # Find the saved journal entry
        saved_journal = SavedJournal.objects.filter(
            user=request.user,
            journal_id=journal_id
        ).first()

        if not saved_journal:
            return Response(
                {'message': 'Journal not found in your saved items'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Delete the saved journal entry
        saved_journal.delete()
        
        return Response(
            {'message': 'Journal removed from saved items successfully'},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {'message': f'Error removing journal: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class ListSavedJournalsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Get all saved journals for the current user
            saved_journals = SavedJournal.objects.filter(user=request.user).select_related('journal')
            
            # Serialize the journals with additional saved info
            journals_data = []
            for saved_journal in saved_journals:
                journal_data = JournalSerializer(saved_journal.journal).data
                journal_data['saved_at'] = saved_journal.saved_at
                journal_data['is_saved'] = True
                journals_data.append(journal_data)

            return Response(journals_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'message': f'Error fetching saved journals: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
