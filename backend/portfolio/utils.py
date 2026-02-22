from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.utils import timezone
import threading

def send_email_async(subject, message, from_email, recipient_list, fail_silently):
    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=fail_silently)
    except Exception as e:
        print(f"Error sending async email: {e}")

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
    
    # Send asynchronously
    thread = threading.Thread(
        target=send_email_async,
        args=(subject, message, settings.DEFAULT_FROM_EMAIL, [settings.NOTIFICATION_EMAIL], True)
    )
    thread.start()

def send_admin_response(instance, response_content):
    """
    Sends an admin response email to the original sender of a contact message.
    Updates the instance with response details.
    """
    subject = f"RE: {instance.subject} - Xclusvs Motion Pictures"
    email_body = f"Hello {instance.name},\n\n{response_content}\n\n---\nBest Regards,\nXMP Team\nXclusvs Motion Pictures"
    
    try:
        # Send asynchronously
        thread = threading.Thread(
            target=send_email_async,
            args=(subject, email_body, settings.DEFAULT_FROM_EMAIL, [instance.email], False)
        )
        thread.start()
        
        # Update the message instance immediately
        instance.response_content = response_content
        instance.responded_at = timezone.now()
        instance.is_read = True
        instance.save()
        return True
    except Exception as e:
        print(f"Error processing admin response: {e}")
        return False

def broadcast_newsletter_async(subject, content, from_email, bcc_list):
    try:
        email = EmailMessage(
            subject=subject,
            body=content,
            from_email=from_email,
            bcc=bcc_list,
        )
        email.send(fail_silently=False)
    except Exception as e:
        print(f"Error broadcasting async newsletter: {e}")

def broadcast_newsletter(subject, content, recipient_list):
    """
    Broadcasts a newsletter to a list of subscribers using BCC for privacy.
    """
    try:
        thread = threading.Thread(
            target=broadcast_newsletter_async,
            args=(subject, content, settings.DEFAULT_FROM_EMAIL, recipient_list)
        )
        thread.start()
        return True
    except Exception as e:
        print(f"Error initiating newsletter broadcast: {e}")
        return False
