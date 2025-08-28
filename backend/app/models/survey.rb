class Survey < ApplicationRecord
  validates :student_id, presence: true, length: { maximum: 20 }
  validates :question1, presence: true, numericality: { only_integer: true }
  validates :question2, presence: true, numericality: { only_integer: true }
  validates :question3, presence: true, numericality: { only_integer: true }
  validates :question4, presence: true, numericality: { only_integer: true }
  validates :question5, presence: true, numericality: { only_integer: true }
end
