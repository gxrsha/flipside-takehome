import React, { useEffect, useState } from "react";
import { Project, ProjectVerticals } from '../api/api'


// To format a new array of objects so it can be used to populate tr element
// [
//   {
//       "vertical": "AMM",
//       "projects": [
//           "Balancer",
//           "Uniswap",
//           "Fantom"
//            etc...
//       ]
//   },
// ]
type ProjectPairs = {
  vertical: string
  projects: string[]
}

type TableProps = {
  verticals?: ProjectVerticals[]
  projects?: Project[]
  dataLoaded?: boolean
}

const Table: React.FC<TableProps> = ({verticals, projects, dataLoaded}) => {

  const [projectPairs, setProjectPairs] = useState<ProjectPairs[]>()


  useEffect(() => {
    if (dataLoaded) setProjectPairs(getProjectPairs(verticals, projects))
  }, [dataLoaded])


  const getProjectPairs = (verticals, projects) => {
    const uniquePairs: ProjectPairs[] = createUniqueVerticalPairs(verticals, projects)
    const projectPairsObj: ProjectPairs[] = createProjectPairs(uniquePairs)
    return projectPairsObj
  }

  const createUniqueVerticalPairs = (verticals: ProjectVerticals[], projects: Project[]) => {

      const uniquePairs: any[] = []

      const projectPairs = verticals.map((vertical) => {
        const match = projects.find(project => project.id === vertical.project_id)
        return {verticals: vertical.verticals, projects: match?.name}
      })

      // console.log('projectPairs: ', projectPairs)

      for (let i = 0; i < projectPairs.length; i++) {
        if (projectPairs[i].verticals.length > 1) {
          projectPairs[i].verticals.forEach((vertical) => {
              uniquePairs.push({vertical: vertical, projects: [projectPairs[i].projects]})
          })
        } else {
          uniquePairs.push({vertical: projectPairs[i].verticals.toString(), projects: [projectPairs[i].projects]})
        }
      }

      // console.log('uniquePairs: ', uniquePairs)

      return uniquePairs

  }

  const createProjectPairs = (uniquePairs: ProjectPairs[]) => {
    const projectMap: any = new Map(uniquePairs.map(({vertical}) => [vertical, {vertical, projects: []}]))

    for (let {vertical, projects} of uniquePairs) {
      projectMap.get(vertical)?.projects.push(...[projects].flat())
    }

    return [...projectMap.values()]
  }

  const sortByVerticals = (unsortedArray) => {
    const sortedArray = [...unsortedArray]
    sortedArray.sort((a, b) => a.vertical.toLowerCase().localeCompare(b.vertical.toLowerCase()))
    setProjectPairs(sortedArray)
  }


  return (
      <table cellPadding="10">
        <tbody>
          <tr style={{ backgroundColor: "gainsboro"}}>
            <td style={{display: 'flex', justifyContent: 'space-between'}}>Vertical{projectPairs ? <button style={{borderRadius: '15px', cursor: 'pointer'}} onClick={() => sortByVerticals(projectPairs)}>sort</button> : ''}</td>
            <td>Projects</td>
          </tr>
          {projectPairs?.map((obj) => <tr key={`${obj.vertical}-row`}>
            <td key={`${obj.vertical}-name`}>{obj.vertical}</td>
            <td key={`${obj.vertical.toString()}-projects`}>{obj.projects.join(', ')}</td>
          </tr>)}
        </tbody>
      </table>
  );
};

export default Table;
