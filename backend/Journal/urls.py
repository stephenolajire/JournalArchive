from django.urls import path
from .views import*
from . import views
from .views import ListSavedJournalsView

urlpatterns = [
    path('submit/', SubmitJournalView.as_view(), name='submit-journal'),
    path('list/', ListUserJournalsView.as_view(), name='my-journals'),
    path('save/', views.save_journal, name='save-journal'),
    path('saved-journals/', ListSavedJournalsView.as_view(), name='saved-journals'),
    path('save/<int:journal_id>/', views.unsave_journal, name='unsave-journal'),
]
