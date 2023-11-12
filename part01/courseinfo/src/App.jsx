const App = () => {
  const Header = ({ name }) => {
    return <header>
      <h1>
        {name}
      </h1>
    </header>
  }

  const Content = ({ parts }) => {
    return <>
    {parts.map(part => <Part {...part} key={part.name}/>)}
    </>

  }

  const Part = ({ name, exercises }) => {
    return <p> {name} {exercises}</p>
  }

  const Total = ({ parts }) => {
    return <p>Number of exercises {parts.reduce((accumulator, currentValue) => accumulator+currentValue.exercises,0)}</p>
  }
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

 


  return (
    <div>
      <Header {...course} />
      <Content {...course} />
      <Total {...course} />
    </div>
  )
}

export default App