import React, { useState, useEffect } from "react";
import { getProjectVerticals, getProjects, Project, ProjectVerticals } from '../api/api'
import Table from "../components/Table";

type Props = {};

const Index: React.FC<Props> = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [verticals, setVerticals] = useState<ProjectVerticals[]>([])
  const [dataLoaded, setDataIsLoaded] = useState<boolean>(false)


  useEffect(() => {
    const getAllProjects = async() => {
      const response = await getProjects()
      const projects = response.data
      setProjects(projects)
    }
  
    const getAllVerticals = async() => {
      const response = await getProjectVerticals()
      const verticals = response.data
      setVerticals(verticals)
    }
  
    getAllProjects()
    getAllVerticals()
  }, [])

  if (projects?.length && verticals?.length && dataLoaded === false) setDataIsLoaded(true)



  return (
    <div style={{ margin: 20 }}>

      <h1>Projects by Vertical</h1>

      <Table verticals={verticals} projects={projects} dataLoaded={dataLoaded} />

    </div>
  );
};

export default Index;
