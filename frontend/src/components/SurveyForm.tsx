import React, { useState } from 'react';
import axios from 'axios';
import './SurveyForm.css';

interface SurveyData {
  student_id: string;
  question1: number;
  question2: number;
  question3: number;
  question4: number;
  question5: number;
}

const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<SurveyData>({
    student_id: '',
    question1: 0,
    question2: 0,
    question3: 0,
    question4: 0,
    question5: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'student_id' ? value : parseInt(value)
    }));
  };

  const getApiUrl = () => {
    // デバッグ用のログ
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All environment variables:', process.env);
    console.log('Current hostname:', window.location.hostname);
    
    // 本番環境の場合は環境変数から取得
    if (process.env.REACT_APP_API_URL) {
      console.log('Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
      return process.env.REACT_APP_API_URL;
    }
    
    // 本番環境のフォールバック（環境変数が読み込まれない場合）
    if (window.location.hostname.includes('onrender.com')) {
      console.log('Using fallback production URL');
      return 'https://survey-app-backend-que0.onrender.com';
    }
    
    // ngrok経由でのアクセスかどうかをチェック
    if (window.location.hostname.includes('ngrok')) {
      // ngrok経由の場合は、ローカルのバックエンドAPIを使用
      return 'http://localhost:3011';
    }
    
    // ローカル開発環境
    return 'http://localhost:3011';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await axios.post(`${getApiUrl()}/api/surveys`, {
        survey: formData
      });

      setMessage('アンケートが正常に送信されました！');
      setFormData({
        student_id: '',
        question1: 0,
        question2: 0,
        question3: 0,
        question4: 0,
        question5: 0
      });
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      if (error.response?.data?.errors) {
        setMessage(`エラー: ${error.response.data.errors.join(', ')}`);
      } else if (error.response?.status) {
        setMessage(`エラー: HTTP ${error.response.status} - ${error.response.statusText}`);
      } else {
        setMessage('アンケートの送信に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="survey-form">
      <h2>アンケート入力</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="student_id">学籍番号 *</label>
          <input
            type="text"
            id="student_id"
            name="student_id"
            value={formData.student_id}
            onChange={handleInputChange}
            required
            maxLength={20}
            placeholder=""
          />
        </div>

        <div className="form-group">
          <label htmlFor="question1">問1</label>
          <input
            type="number"
            id="question1"
            name="question1"
            value={formData.question1}
            onChange={handleInputChange}
            required
            placeholder="数値を入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="question2">問2</label>
          <input
            type="number"
            id="question2"
            name="question2"
            value={formData.question2}
            onChange={handleInputChange}
            required
            placeholder="数値を入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="question3">問3</label>
          <input
            type="number"
            id="question3"
            name="question3"
            value={formData.question3}
            onChange={handleInputChange}
            required
            placeholder="数値を入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="question4">問4</label>
          <input
            type="number"
            id="question4"
            name="question4"
            value={formData.question4}
            onChange={handleInputChange}
            required
            placeholder="数値を入力してください"
          />
        </div>

        <div className="form-group">
          <label htmlFor="question5">問5</label>
          <input
            type="number"
            id="question5"
            name="question5"
            value={formData.question5}
            onChange={handleInputChange}
            required
            placeholder="数値を入力してください"
          />
        </div>

        {message && (
          <div className={`message ${message.includes('エラー') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? '送信中...' : 'アンケートを送信'}
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
