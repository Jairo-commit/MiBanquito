from django.contrib import admin
from products.models import CDT, LoanRequest

admin.site.register(LoanRequest)
admin.site.register(CDT)
