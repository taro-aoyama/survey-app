require "test_helper"

class Api::ExportsControllerTest < ActionDispatch::IntegrationTest
  test "should get csv" do
    get api_exports_csv_url
    assert_response :success
  end
end
