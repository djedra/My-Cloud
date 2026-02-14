from django.urls import path
from . import views

urlpatterns = [
    path('files/', views.get_files, name='file_list'),
    path('files/upload/', views.upload_file, name='file_upload'),
    path('files/<int:file_id>/', views.delete_file, name='file_delete'),
    path('files/<int:file_id>/rename/', views.rename_file, name='file_rename'),
    path('files/<int:file_id>/comment/', views.update_file_comment, name='file_comment'),
    path('files/<int:file_id>/download/', views.download_file, name='file_download'),
    path('files/<int:file_id>/public/', views.toggle_file_public, name='file_toggle_public'),

    # Публичные ссылки
    path('share/<uuid:token>/', views.download_file_by_token, name='file_share'),

    # Папки
    path('folders/', views.FolderListCreateView.as_view(), name='folder_list'),
    path('folders/<int:pk>/', views.FolderDetailView.as_view(), name='folder_detail'),
]