import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Filler, BarElement } from 'chart.js';

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Filler, BarElement);

const ArticleChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch articles from your API
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/getArticles_locally.php`);
        const articles = await response.json();

        const yearCount = articles.reduce((acc, article) => {
          const year = article.annee; // Assuming 'annee' is the year field
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});

        // Prepare the data for the chart
        const years = Object.keys(yearCount).sort();
        const counts = years.map(year => yearCount[year]);

        setChartData({
          labels: years,
          datasets: [
            {
              label: 'Articles Published',
              data: counts,
              borderColor: '#4b6cc0',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    return () => {
      // Cleanup the chart instance when the component unmounts or updates
      if (window.Chart && window.Chart.instances) {
        window.Chart.instances.forEach((instance) => {
          instance.destroy();
        });
      }
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full h-56 sm:h-72 lg:h-80">
      <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
};

export default ArticleChart;
