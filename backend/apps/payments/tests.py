from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.orders.models import Order
from .models import Payment
from decimal import Decimal
from django.core.exceptions import ValidationError

User = get_user_model()


class PaymentModelTest(TestCase):
    """
    Testes para o model Payment usando dados reais do Pará
    """

    def setUp(self):
        """
        Configuração inicial para os testes
        """
        self.user = User.objects.create_user(
            username='rafaelgoes',
            email='rafaelgpesti2021@gmail.com',
            password='testpass123',
            nome='Rafael Góes'
        )

        self.order = Order.objects.create(
            user=self.user,
            status='pending',
            total=Decimal('250.00'),
            payment_method='pix',
            address=' Parque Verde, Belém - PA',
            city='Belém',
            state='PA',
            zip_code='66053-000',
            cpf='123.456.789-00',
            phone='(91) 98608-3776'
        )

    def create_payment(self, status='pendente', method='pix', amount=Decimal('250.00')):
        """
        Helper method para criar pagamentos
        """
        return Payment.objects.create(
            order=self.order,
            user=self.user,
            method=method,
            status=status,
            amount=amount,
            transaction_id=f'MP{Payment.objects.count()+1}'
        )

    def test_create_payment(self):
        """
        Testa a criação de um pagamento
        """
        payment = self.create_payment()
        self.assertEqual(payment.order, self.order)
        self.assertEqual(payment.user, self.user)
        self.assertEqual(payment.method, 'pix')
        self.assertEqual(payment.status, 'pendente')
        self.assertEqual(payment.amount, Decimal('250.00'))

    def test_payment_str_representation(self):
        """
        Testa a representação string do pagamento
        """
        payment = self.create_payment(status='pago', method='credit_card')
        expected_str = f"Pagamento {payment.id} - {self.user.nome} - Pedido #{self.order.id} - {payment.get_status_display()}"
        self.assertEqual(str(payment), expected_str)

    def test_payment_choices(self):
        """
        Testa se os choices estão funcionando corretamente
        """
        payment = self.create_payment(status='pago', method='pix')
        self.assertEqual(payment.get_method_display(), 'PIX')
        self.assertEqual(payment.get_status_display(), 'Pago')

    def test_cannot_modify_processed_payment(self):
        """
        Testa se não é possível modificar campos críticos de um pagamento processado
        """
        payment = self.create_payment(status='pago')
        payment.amount = Decimal('300.00')

        with self.assertRaises(ValidationError):
            payment.save()

    def test_can_modify_pending_payment(self):
        """
        Testa se é possível modificar um pagamento pendente
        """
        payment = self.create_payment(status='pendente')
        payment.amount = Decimal('300.00')
        payment.save()
        payment.refresh_from_db()
        self.assertEqual(payment.amount, Decimal('300.00'))
