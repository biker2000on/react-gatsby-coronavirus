import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import axios from 'axios'

import Layout from 'components/Layout';
import Container from 'components/Container';

import "react-tabulator/lib/styles.css"; // default theme
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
import { ReactTabulator } from 'react-tabulator'

const SecondPage = () => {

  const [ data, setData ] = useState([])

  const columns = [
    {title: "Country", field: "country"},
    {title: "Updated", field: "updated"},
    {title: "Cases", field: "cases"},
    {title: "Today's Cases", field: "todayCases"},
    {title: "Cases / 1M", field: "casesPerOneMillion"},
    {title: "Deaths / 1M", field: "deathsPerOneMillion"},
    {title: "Deaths", field: "deaths"},
    {title: "Today's Deaths", field: "todayDeaths"},
    {title: "Recovered", field: "recovered"},
    {title: "Active", field: "active"},
    {title: "Tests", field: "tests"},
  ]

  useEffect(() => {
    async function fetchData() {

      let response
  
      try {
        response = await axios.get('https://corona.lmao.ninja/countries')
      } catch (e) {
        console.log(`Failed to fetch countries: ${e.message}`, e)
        return
      }
  
      const { data = {} } = response
      const hasData = Array.isArray(data) && data.length > 0
  
      if ( !hasData ) return
  
      console.log(data)
      setData(data)
    }

    fetchData()
  },[])


  return (
    <Layout pageName="two">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Container type="content" className="text-center">
        <h1>Coronavirus Table</h1>
      </Container>
      <ReactTabulator 
        columns={columns}
        data={data}
      ></ReactTabulator>
    </Layout>
  );
};

export default SecondPage;
