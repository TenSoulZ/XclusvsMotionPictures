from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.utils import timezone

def send_contact_notification(instance):
    """
    Sends an email notification to the site admin about a new contact message.
    """
    subject = f"New Contact Message: {instance.subject}"
    message = f"You have received a new message from your website.\n\n" \
              f"Name: {instance.name}\n" \
              f"Email: {instance.email}\n" \
              f"Subject: {instance.subject}\n\n" \
              f"Message:\n{instance.message}\n\n" \
              f"Date: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.NOTIFICATION_EMAIL],
            fail_silently=True,
        )
    except Exception as e:
        # In a production environment, this should be logged properly
        print(f"Error sending contact email: {e}")

def send_admin_response(instance, response_content):
    """
    Sends an admin response email to the original sender of a contact message.
    Updates the instance with response details.
    """
    subject = f"RE: {instance.subject} - Xclusvs Motion Pictures"
    email_body = f"Hello {instance.name},\n\n{response_content}\n\n---\nBest Regards,\nXMP Team\nXclusvs Motion Pictures"
    
    try:
        send_mail(
            subject,
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )
        
        # Update the message instance
        instance.response_content = response_content
        instance.responded_at = timezone.now()
        instance.is_read = True
        instance.save()
        return True
    except Exception as e:
        print(f"Error sending admin response: {e}")
        return False

def broadcast_newsletter(subject, content, recipient_list):
    """
    Broadcasts a newsletter to a list of subscribers using BCC for privacy.
    """
    try:
        email = EmailMessage(
            subject=subject,
            body=content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            bcc=recipient_list,
        )
        email.send(fail_silently=False)
        return True
    except Exception as e:
        print(f"Error broadcasting newsletter: {e}")
        return False
