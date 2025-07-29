import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    try {
      let data = await fetch(url);
      props.setProgress(30);
      let parseData = await data.json();
      props.setProgress(70);

      console.log("Fetched on update:", parseData);
      setArticles(Array.isArray(parseData.articles) ? parseData.articles : []);
      setTotalResults(parseData.totalResults || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
    props.setProgress(100);
  };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${nextPage}&pageSize=${props.pageSize}`;
   

    try {
      let data = await fetch(url);
      let parseData = await data.json();
      console.log("Fetched on scroll:", parseData);

      if (Array.isArray(parseData.articles)) {
        setArticles((prevArticles) => prevArticles.concat(parseData.articles));
        setTotalResults(parseData.totalResults || totalResults);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
      setLoading(false);
    }
  };

  return (
    <>
     <h1 className="text-center" style={{ margin: "35px 0px", marginTop: '90px' }}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={
                    element.description
                      ? element.description.slice(0, 88)
                      : ""
                  }
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source?.name || "Unknown"}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apikey: PropTypes.string,
  setProgress: PropTypes.func,
};

export default News;
