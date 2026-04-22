import factory
from django.contrib.auth import get_user_model

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    password = factory.PostGenerationMethodCall("set_password", "SecurePass1@")
    document_type = "CC"
    document_number = factory.Sequence(lambda n: f"{100000000 + n}")
    full_name = factory.Faker("name")
    city = factory.Faker("city")
    phone = factory.Faker("numerify", text="3#########")
