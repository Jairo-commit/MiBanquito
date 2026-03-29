from django.contrib import admin
from accounts.models import AccountMovement, SavingsAccount

admin.site.register(SavingsAccount)
admin.site.register(AccountMovement)
