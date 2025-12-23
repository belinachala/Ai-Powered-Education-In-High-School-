from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.db.session import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/directors", tags=["Directors"])

# GET /directors/me/profile
@router.get("/me/profile")
def get_director_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "schooldirector":
        raise HTTPException(status_code=403, detail="Only directors can access this profile")

    # Return profile info
    return {
        "director_id": current_user.director_id,
        "gender": current_user.gender,
        "date_of_birth": current_user.date_of_birth,
        "school_name": current_user.school_name,
        "region": current_user.region,
        "subcity": current_user.subcity,
        "woreda": current_user.woreda,
        "zone": current_user.zone,
        "years_of_experience": current_user.years_of_experience,
        "profile_picture_url": current_user.profile_picture_url
    }
