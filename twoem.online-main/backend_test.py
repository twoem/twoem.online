import requests
import json
import base64
import os
import time
import unittest
from pathlib import Path

# Get the backend URL from the frontend .env file
def get_backend_url():
    env_file = Path("/app/frontend/.env")
    if not env_file.exists():
        return "https://88ed5a4b-615b-4f43-8e18-663f3d120d28.preview.emergentagent.com"
    
    with open(env_file, "r") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                return line.strip().split("=", 1)[1].strip('"')
    
    return "https://88ed5a4b-615b-4f43-8e18-663f3d120d28.preview.emergentagent.com"

# Base URL for API requests
BASE_URL = f"{get_backend_url()}/api"
print(f"Using backend URL: {BASE_URL}")

class TWOEMBackendTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.admin_token = None
        cls.student_token = None
        cls.student_id = None
        cls.test_student_username = f"teststudent_{int(time.time())}"
        cls.test_student_password = "Test@123"
        
        # Create a sample certificate file for testing
        cls.cert_file_path = Path("/app/test_certificate.pdf")
        with open(cls.cert_file_path, "wb") as f:
            f.write(b"This is a test certificate file")
    
    @classmethod
    def tearDownClass(cls):
        # Clean up the test certificate file
        if cls.cert_file_path.exists():
            cls.cert_file_path.unlink()
    
    def test_01_health_check(self):
        """Test the health check endpoint"""
        response = requests.get(f"{BASE_URL}/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        print("✅ Health check endpoint is working")
    
    def test_02_admin_login_success(self):
        """Test admin login with default credentials"""
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": "admin123"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "bearer")
        
        # Save the admin token for later tests
        self.__class__.admin_token = data["access_token"]
        print("✅ Admin login successful")
    
    def test_03_admin_login_invalid(self):
        """Test invalid login attempts"""
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": "wrongpassword"}
        )
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("detail", data)
        print("✅ Invalid login attempt correctly rejected")
    
    def test_04_jwt_token_validation(self):
        """Test JWT token validation"""
        # Test with valid token
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["username"], "admin")
        self.assertEqual(data["role"], "admin")
        
        # Test with invalid token
        headers = {"Authorization": "Bearer invalidtoken"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        self.assertEqual(response.status_code, 401)
        print("✅ JWT token validation is working")
    
    def test_05_password_change(self):
        """Test password change functionality"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        # Change password to a temporary one
        temp_password = "temppassword123"
        response = requests.post(
            f"{BASE_URL}/auth/change-password",
            headers=headers,
            json={"new_password": temp_password}
        )
        self.assertEqual(response.status_code, 200)
        
        # Try logging in with the new password
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": temp_password}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        
        # Change password back to the original
        headers = {"Authorization": f"Bearer {data['access_token']}"}
        response = requests.post(
            f"{BASE_URL}/auth/change-password",
            headers=headers,
            json={"new_password": "admin123"}
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify we can log in with the original password again
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": "admin", "password": "admin123"}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.__class__.admin_token = data["access_token"]
        print("✅ Password change functionality is working")
    
    def test_06_student_creation(self):
        """Test student creation endpoint"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        student_data = {
            "username": self.__class__.test_student_username,
            "password": self.__class__.test_student_password,
            "full_name": "Test Student",
            "id_number": "TS12345",
            "email": "teststudent@example.com",
            "phone": "1234567890"
        }
        
        response = requests.post(
            f"{BASE_URL}/admin/students",
            headers=headers,
            json=student_data
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["username"], student_data["username"])
        self.assertEqual(data["full_name"], student_data["full_name"])
        self.assertEqual(data["id_number"], student_data["id_number"])
        
        # Save the student ID for later tests
        self.__class__.student_id = data["id"]
        print("✅ Student creation endpoint is working")
    
    def test_07_student_listing(self):
        """Test student listing endpoint"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        response = requests.get(f"{BASE_URL}/admin/students", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        
        # Verify our test student is in the list
        found = False
        for student in data:
            if student["id"] == self.__class__.student_id:
                found = True
                break
        self.assertTrue(found, "Test student not found in student listing")
        print("✅ Student listing endpoint is working")
    
    def test_08_individual_student_retrieval(self):
        """Test individual student retrieval endpoint"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        response = requests.get(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}",
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], self.__class__.student_id)
        self.assertEqual(data["username"], self.__class__.test_student_username)
        print("✅ Individual student retrieval endpoint is working")
    
    def test_09_academic_record_updates(self):
        """Test academic record updates endpoint"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        academic_data = {
            "ms_word": 85,
            "ms_excel": 90,
            "ms_powerpoint": 95,
            "ms_access": 80,
            "computer_intro": 88
        }
        
        response = requests.put(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}/academic",
            headers=headers,
            json=academic_data
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify the academic record was updated
        response = requests.get(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}",
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsNotNone(data["academic_record"])
        self.assertEqual(data["academic_record"]["ms_word"], academic_data["ms_word"])
        self.assertEqual(data["academic_record"]["ms_excel"], academic_data["ms_excel"])
        
        # Test validation of academic scores (must be 0-100)
        invalid_data = {"ms_word": 101}  # Invalid score > 100
        response = requests.put(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}/academic",
            headers=headers,
            json=invalid_data
        )
        self.assertEqual(response.status_code, 422)  # Validation error
        print("✅ Academic record updates endpoint is working with proper validation")
    
    def test_10_finance_record_updates(self):
        """Test finance record updates endpoint"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        finance_data = {
            "total_fees": 1000.0,
            "paid_amount": 500.0,
            "payment_reference": "PAY123456"
        }
        
        response = requests.put(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}/finance",
            headers=headers,
            json=finance_data
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify the finance record was updated and balance calculated correctly
        response = requests.get(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}",
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsNotNone(data["finance_record"])
        self.assertEqual(data["finance_record"]["total_fees"], finance_data["total_fees"])
        self.assertEqual(data["finance_record"]["paid_amount"], finance_data["paid_amount"])
        self.assertEqual(data["finance_record"]["balance"], finance_data["total_fees"] - finance_data["paid_amount"])
        self.assertFalse(data["finance_record"]["is_cleared"])
        
        # Update to clear the balance
        finance_data = {
            "paid_amount": 1000.0,
        }
        
        response = requests.put(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}/finance",
            headers=headers,
            json=finance_data
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify the balance is cleared
        response = requests.get(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}",
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["finance_record"]["balance"], 0.0)
        self.assertTrue(data["finance_record"]["is_cleared"])
        print("✅ Finance record updates endpoint is working with proper calculations")
    
    def test_11_certificate_upload(self):
        """Test certificate upload functionality"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        with open(self.__class__.cert_file_path, "rb") as f:
            files = {"file": ("test_certificate.pdf", f, "application/pdf")}
            response = requests.post(
                f"{BASE_URL}/admin/students/{self.__class__.student_id}/certificate",
                headers=headers,
                files=files
            )
        
        self.assertEqual(response.status_code, 200)
        
        # Verify the certificate was uploaded
        response = requests.get(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}",
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsNotNone(data["certificate"])
        self.assertEqual(data["certificate"]["filename"], "test_certificate.pdf")
        self.assertTrue(data["has_certificate"])
        print("✅ Certificate upload functionality is working")
    
    def test_12_student_login(self):
        """Test student login"""
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": self.__class__.test_student_username, "password": self.__class__.test_student_password}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        
        # Save the student token for later tests
        self.__class__.student_token = data["access_token"]
        print("✅ Student login is working")
    
    def test_13_student_profile_retrieval(self):
        """Test student profile retrieval endpoint"""
        headers = {"Authorization": f"Bearer {self.__class__.student_token}"}
        
        response = requests.get(f"{BASE_URL}/student/profile", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], self.__class__.student_id)
        self.assertEqual(data["username"], self.__class__.test_student_username)
        print("✅ Student profile retrieval endpoint is working")
    
    def test_14_parent_contacts_update(self):
        """Test parent contacts update endpoint"""
        headers = {"Authorization": f"Bearer {self.__class__.student_token}"}
        
        parent_data = {
            "father_name": "John Doe",
            "father_phone": "1234567890",
            "mother_name": "Jane Doe",
            "mother_phone": "0987654321",
            "guardian_name": "Guardian Name",
            "guardian_phone": "5555555555"
        }
        
        response = requests.put(
            f"{BASE_URL}/student/parent-contacts",
            headers=headers,
            json=parent_data
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify the parent contacts were updated
        response = requests.get(f"{BASE_URL}/student/profile", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsNotNone(data["parent_contacts"])
        self.assertEqual(data["parent_contacts"]["father_name"], parent_data["father_name"])
        self.assertEqual(data["parent_contacts"]["mother_name"], parent_data["mother_name"])
        print("✅ Parent contacts update endpoint is working")
    
    def test_15_certificate_download_eligibility(self):
        """Test certificate download with eligibility checks"""
        headers = {"Authorization": f"Bearer {self.__class__.student_token}"}
        
        # Student should be eligible (average ≥60% AND fees cleared)
        response = requests.get(f"{BASE_URL}/student/certificate", headers=headers)
        self.assertEqual(response.status_code, 200)
        
        # Verify eligibility in profile
        response = requests.get(f"{BASE_URL}/student/profile", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["has_certificate"])
        self.assertTrue(data["can_download_certificate"])
        self.assertGreaterEqual(data["average_score"], 60)
        print("✅ Certificate download with eligibility checks is working")
    
    def test_16_role_based_access_control(self):
        """Test role-based access control"""
        # Student trying to access admin endpoint
        student_headers = {"Authorization": f"Bearer {self.__class__.student_token}"}
        response = requests.get(f"{BASE_URL}/admin/students", headers=student_headers)
        self.assertEqual(response.status_code, 403)
        
        # Admin trying to access student endpoint
        admin_headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        response = requests.get(f"{BASE_URL}/student/profile", headers=admin_headers)
        self.assertEqual(response.status_code, 403)
        print("✅ Role-based access control is working")
    
    def test_17_edge_case_missing_data(self):
        """Test handling of missing/invalid data"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        # Missing required fields
        response = requests.post(
            f"{BASE_URL}/admin/students",
            headers=headers,
            json={"username": "incomplete"}
        )
        self.assertEqual(response.status_code, 422)  # Validation error
        print("✅ Handling of missing/invalid data is working")
    
    def test_18_edge_case_unauthorized_access(self):
        """Test unauthorized access attempts"""
        # No token provided
        response = requests.get(f"{BASE_URL}/admin/students")
        self.assertEqual(response.status_code, 403)  # The API returns 403 instead of 401 for missing token
        print("✅ Unauthorized access attempts are properly handled")
    
    def test_19_edge_case_average_score_calculations(self):
        """Test average score calculations with missing scores"""
        headers = {"Authorization": f"Bearer {self.__class__.admin_token}"}
        
        # Update with partial scores
        academic_data = {
            "ms_word": 70,
            "ms_excel": 80,
            # Missing ms_powerpoint, ms_access, computer_intro
        }
        
        response = requests.put(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}/academic",
            headers=headers,
            json=academic_data
        )
        self.assertEqual(response.status_code, 200)
        
        # Verify average is calculated correctly with partial scores
        response = requests.get(
            f"{BASE_URL}/admin/students/{self.__class__.student_id}",
            headers=headers
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Calculate expected average (only using the provided scores)
        expected_avg = (academic_data["ms_word"] + academic_data["ms_excel"]) / 2
        self.assertEqual(data["average_score"], expected_avg)
        print("✅ Average score calculations with missing scores is working")

if __name__ == "__main__":
    unittest.main()