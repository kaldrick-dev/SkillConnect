def test_user_registration_and_login(client):
    # 1. Register a new student user
    register_payload = {
        "email": "student_test@example.com",
        "password": "Password123!",
        "full_name": "Test Student",
        "role": "student"
    }
    
    register_response = client.post("/api/auth/register", json=register_payload)
    
    # Assert registration succeeds (201 Created or 200 OK)
    assert register_response.status_code in [200, 201]

    # 2. Log in with the newly registered credentials
    login_payload = {
        "email": "student_test@example.com",
        "password": "Password123!"
    }
    
    login_response = client.post("/api/auth/login", json=login_payload)
    
    # Assert login succeeds and returns an access token
    assert login_response.status_code == 200
    json_data = login_response.get_json()
    assert "access_token" in json_data or "token" in json_data