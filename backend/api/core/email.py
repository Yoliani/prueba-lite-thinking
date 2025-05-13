from fastapi import HTTPException
import resend
from api.core.config import settings


class EmailManager:

    def __init__(self) -> None:
        resend.api_key = settings.RESEND_KEY

    async def send_email(self, to: str, subject: str, body: str, attachments: list[resend.Attachment] = None):
        try:
            params: resend.Emails.SendParams = {
                "from": "Lite Thinking <onboarding@yoliani.dev>",
                "to": [to],
                "subject": subject,

                "html": body,
            }

            if attachments:
                params['attachments'] = attachments

            r = resend.Emails.send(params)

            print(r)
            return r
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


email_manager = EmailManager()
