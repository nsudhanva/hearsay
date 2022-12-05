from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:article_id>/', views.show, name='show'),
    path('ml/', views.ml, name='ml'),
]
