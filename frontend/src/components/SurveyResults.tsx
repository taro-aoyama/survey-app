import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SurveyResults.css';

interface Survey {
  id: number;
  student_id: string;
  question1: number;
  question2: number;
  question3: number;
  question4: number;
  question5: number;
  created_at: string;
}

const SurveyResults: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3011'}/api/surveys`);
      setSurveys(response.data);
      setError('');
    } catch (error: any) {
      setError('アンケート結果の取得に失敗しました。');
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVDownload = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3011'}/api/exports/csv`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `survey_results_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setError('CSVのダウンロードに失敗しました。');
      console.error('Error downloading CSV:', error);
    }
  };

  const getQuestionLabel = (questionNumber: number) => {
    return `問${questionNumber}`;
  };

  const getRatingLabel = (rating: number) => {
    return rating.toString();
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchSurveys} className="retry-btn">再試行</button>
      </div>
    );
  }

  return (
    <div className="survey-results">
      <div className="results-header">
        <h2>アンケート結果</h2>
        <button onClick={handleCSVDownload} className="download-btn">
          CSVダウンロード
        </button>
      </div>

      {surveys.length === 0 ? (
        <div className="no-results">
          <p>まだアンケートが送信されていません。</p>
        </div>
      ) : (
        <div className="results-summary">
          <p>総回答数: {surveys.length}件</p>
          
          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>学籍番号</th>
                  <th>問1</th>
                  <th>問2</th>
                  <th>問3</th>
                  <th>問4</th>
                  <th>問5</th>
                  <th>回答日時</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey) => (
                  <tr key={survey.id}>
                    <td>{survey.student_id}</td>
                    <td>{getRatingLabel(survey.question1)}</td>
                    <td>{getRatingLabel(survey.question2)}</td>
                    <td>{getRatingLabel(survey.question3)}</td>
                    <td>{getRatingLabel(survey.question4)}</td>
                    <td>{getRatingLabel(survey.question5)}</td>
                    <td>{new Date(survey.created_at).toLocaleString('ja-JP')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="question-summaries">
            {[1, 2, 3, 4, 5].map((questionNum) => {
              const questionKey = `question${questionNum}` as keyof Survey;
              const ratings = surveys.map(s => s[questionKey] as number);
              const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
              
              // 統計情報を計算
              const minRating = Math.min(...ratings);
              const maxRating = Math.max(...ratings);
              const sortedRatings = ratings.sort((a, b) => a - b);
              const medianRating = sortedRatings[Math.floor(sortedRatings.length / 2)];
              
              // 実際のデータに基づいて分布を作成
              const uniqueRatings = ratings.filter((rating, index, arr) => arr.indexOf(rating) === index).sort((a, b) => a - b);
              
              return (
                <div key={questionNum} className="question-summary">
                  <h4>{getQuestionLabel(questionNum)}</h4>
                  <div className="stats-overview">
                    <div className="stat-item">
                      <span className="stat-label">回答数</span>
                      <span className="stat-value">{ratings.length}件</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">平均値</span>
                      <span className="stat-value">{avgRating.toFixed(1)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">中央値</span>
                      <span className="stat-value">{medianRating}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">範囲</span>
                      <span className="stat-value">{minRating} - {maxRating}</span>
                    </div>
                  </div>
                  
                  <div className="distribution-chart">
                    <h5>数値の分布（ヒストグラム）</h5>
                    <div className="histogram">
                      <div className="histogram-container">
                        {uniqueRatings.map((rating) => {
                          const count = ratings.filter(r => r === rating).length;
                          const percentage = (count / ratings.length) * 100;
                          const maxCount = Math.max(...uniqueRatings.map(r => ratings.filter(rating => rating === r).length));
                          const barHeight = (count / maxCount) * 100;
                          
                          return (
                            <div key={rating} className="histogram-bar">
                              <div className="bar-container">
                                <div 
                                  className="bar" 
                                  style={{ height: `${barHeight}%` }}
                                  title={`数値${rating}: ${count}人 (${percentage.toFixed(1)}%)`}
                                ></div>
                              </div>
                              <div className="bar-label">{rating}</div>
                              <div className="bar-count">{count}人</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="histogram-axis">
                        <div className="y-axis">
                          <span className="axis-label">人数</span>
                        </div>
                        <div className="x-axis">
                          <span className="axis-label">数値</span>
                        </div>
                      </div>
                    </div>
                    <div className="chart-legend">
                      <p>※ 各棒の高さは回答人数を表しています。数値の分布パターンが一目で分かります</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResults;
