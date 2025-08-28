class CreateSurveys < ActiveRecord::Migration[7.2]
  def change
    create_table :surveys do |t|
      t.string :student_id
      t.integer :question1
      t.integer :question2
      t.integer :question3
      t.integer :question4
      t.integer :question5

      t.timestamps
    end
  end
end
