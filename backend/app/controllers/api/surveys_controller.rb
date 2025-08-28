class Api::SurveysController < ApplicationController
  def index
    @surveys = Survey.all
    render json: @surveys
  end

  def show
    @survey = Survey.find(params[:id])
    render json: @survey
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'アンケートが見つかりません' }, status: :not_found
  end

  def create
    @survey = Survey.new(survey_params)

    if @survey.save
      render json: @survey, status: :created
    else
      render json: { errors: @survey.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def survey_params
    params.require(:survey).permit(:student_id, :question1, :question2, :question3, :question4, :question5)
  end
end
