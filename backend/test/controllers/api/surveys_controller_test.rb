require "test_helper"

class Api::SurveysControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_surveys_index_url
    assert_response :success
  end

  test "should get create" do
    get api_surveys_create_url
    assert_response :success
  end

  test "should get show" do
    get api_surveys_show_url
    assert_response :success
  end
end
