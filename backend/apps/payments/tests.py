from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.orders.models import Order
from .models import Payment

User = get_user_model()


class PaymentModelTest(TestCase):
    """
    Testes para o model Payment
    """
    
    def setUp(self):
        """
        Configuração inicial para os testes
        """
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.order = Order.objects.create(
            user=self.user,
            status='pending',
            total=100.00,
            payment_method='pix',
            address='Rua Teste, 123',
            city='São Paulo',
            state='SP',
            zip_code='01234-567',
            cpf='123.456.789-00',
            phone='(11) 99999-9999'
        )
    
    def test_create_payment(self):
        """
        Testa a criação de um pagamento
        """
        payment = Payment.objects.create(
            order=self.order,
            method='pix',
            status='pendente',
            amount=100.00,
            transaction_id='MP123456789'
        )
        
        self.assertEqual(payment.order, self.order)
        self.assertEqual(payment.method, 'pix')
        self.assertEqual(payment.status, 'pendente')
        self.assertEqual(payment.amount, 100.00)
        self.assertEqual(payment.transaction_id, 'MP123456789')
    
    def test_payment_str_representation(self):
        """
        Testa a representação string do pagamento
        """
        payment = Payment.objects.create(
            order=self.order,
            method='credit_card',
            status='pago',
            amount=100.00,
            transaction_id='MP123456789'
        )
        
        expected_str = f"Pagamento {payment.id} - Pedido #{self.order.id} - Pago"
        self.assertEqual(str(payment), expected_str)
    
    def test_payment_choices(self):
        """
        Testa se os choices estão funcionando corretamente
        """
        payment = Payment.objects.create(
            order=self.order,
            method='pix',
            status='pago',
            amount=100.00,
            transaction_id='MP123456789'
        )
        
        self.assertEqual(payment.get_method_display(), 'PIX')
        self.assertEqual(payment.get_status_display(), 'Pago')
    
    def test_cannot_modify_processed_payment(self):
        """
        Testa se não é possível modificar campos críticos de um pagamento processado
        """
        # Criar um pagamento pago
        payment = Payment.objects.create(
            order=self.order,
            method='pix',
            status='pago',
            amount=100.00,
            transaction_id='MP123456789'
        )
        
        # Tentar alterar o valor - deve gerar erro
        payment.amount = 200.00
        
        with self.assertRaises(Exception):  # ValidationError
            payment.save()
    
    def test_can_modify_pending_payment(self):
        """
        Testa se é possível modificar um pagamento pendente
        """
        # Criar um pagamento pendente
        payment = Payment.objects.create(
            order=self.order,
            method='pix',
            status='pendente',
            amount=100.00,
            transaction_id='MP123456789'
        )
        
        # Alterar o valor - deve funcionar
        payment.amount = 150.00
        payment.save()  # Não deve gerar erro
        
        payment.refresh_from_db()
        self.assertEqual(payment.amount, 150.00)
