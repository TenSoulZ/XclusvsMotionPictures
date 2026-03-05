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

def broadcast_newsletter_async(subject, content, from_email, subscribers):
    # If using BCC, we can't include individual unsubscribe links.
    # For a proper newsletter, we should send individual emails or use an ESP.
    # Here, we will iterate and send individual emails to support unsubscribe links.
    # Note: For very large lists, this should be moved to a task queue like Celery.
    
    frontend_url = settings.CORS_ALLOWED_ORIGINS[0] if settings.CORS_ALLOWED_ORIGINS else 'http://localhost:5173'
    
    for sub in subscribers:
        try:
            unsubscribe_link = f"{frontend_url}/unsubscribe?token={sub.unsubscribe_token}"
            email_body = f"{content}\n\n---\nTo unsubscribe, click here: {unsubscribe_link}"
            
            send_mail(
                subject,
                email_body,
                from_email,
                [sub.email],
                fail_silently=True
            )
        except Exception as e:
            print(f"Error sending newsletter to {sub.email}: {e}")

def broadcast_newsletter(subject, content, subscribers):
    """
    Broadcasts a newsletter to a list of subscribers.
    """
    try:
        # Convert QuerySet to list of objects to pass to thread if needed, 
        # but better to pass IDs and re-fetch if using Celery. 
        # For threads, passing objects is okay but be careful with DB connections.
        # Here we'll evaluate the queryset to a list to avoid thread safety issues with DB cursors.
        subscriber_list = list(subscribers)
        
        thread = threading.Thread(
            target=broadcast_newsletter_async,
            args=(subject, content, settings.DEFAULT_FROM_EMAIL, subscriber_list)
        )
        thread.start()
        return True
    except Exception as e:
        print(f"Error initiating newsletter broadcast: {e}")
        return False
