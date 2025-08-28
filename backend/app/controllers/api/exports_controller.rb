require 'csv'

class Api::ExportsController < ApplicationController
  def csv
    @surveys = Survey.all

    csv_data = CSV.generate(headers: true) do |csv|
      csv << ['学籍番号', '問1', '問2', '問3', '問4', '問5', '作成日時']

      @surveys.each do |survey|
        csv << [
          survey.student_id,
          survey.question1,
          survey.question2,
          survey.question3,
          survey.question4,
          survey.question5,
          survey.created_at.strftime('%Y-%m-%d %H:%M:%S')
        ]
      end
    end

    send_data csv_data,
              filename: "survey_results_#{Date.current.strftime('%Y%m%d')}.csv",
              type: 'text/csv; charset=shift_jis'
  end
end
