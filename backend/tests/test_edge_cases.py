def test_duplicate_email_registration_fails(client):
    # 1. Define the user data
    user_payload = {
        "email": "edgecase@example.com",
        "password": "SecurePassword123!",
        "full_name": "Edge Case User",
        "role": "student"
    }
    
    # 2. Register the user the first time (This should succeed)
    first_response = client.post("/api/auth/register", json=user_payload)
    assert first_response.status_code in [200, 201]

    # 3. Attempt to register again with the EXACT same email
    second_response = client.post("/api/auth/register", json=user_payload)
    
    # 4. Assert that the application properly rejects the duplicate
    # (Expecting 400 Bad Request or 409 Conflict)
    assert second_response.status_code in [400, 409]

def test_registration_missing_fields_fails(client):
    # Payload missing the 'password' field
    incomplete_payload = {
        "email": "incomplete@example.com",
        "full_name": "Incomplete User",
        "role": "student"
    }
    
    response = client.post("/api/auth/register", json=incomplete_payload)
    
    # Assert that the API rejects bad data
    assert response.status_code == 400

def test_apply_to_nonexistent_internship_fails(client):
    # Register and login a student to get a valid auth token
    student_payload = {
        "email": "applicant_edge@example.com",
        "password": "Password123!",
        "full_name": "Applicant Edge",
        "role": "student"
    }
    client.post("/api/auth/register", json=student_payload)
    
    login_res = client.post("/api/auth/login", json={
        "email": "applicant_edge@example.com",
        "password": "Password123!"
    })
    token = login_res.get_json().get("access_token") or login_res.get_json().get("token")
    
    # Attempt to apply to an internship ID that definitely doesn't exist
    response = client.post(
        "/api/internships/9999/apply",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # Assert that the API catches the missing resource
    assert response.status_code == 404