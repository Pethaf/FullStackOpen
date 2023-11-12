const App = () => {
  const Header = ({ name }) => {
    return <header>
      <h1>
        {name}
      </h1>
    </header>
  }

  const Content = ({ content }) => {
    return <p>
      {content}
    </p>
  }


  const Total = ({ total }) => {
    return <p>Number of exercises {total}</p>
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

  const Part = ({ name, exercises }) => {
    return <p> {name} {exercises}</p>
  }


  return (
    <div>
      <Header {...course} />
      {course.parts.map(part => {
        return <Part {...part} key={part.name}/>
      })}
      <p>Number of exercises {course.parts.reduce((accumulator, currentValue) => {return accumulator+currentValue.exercises}, 0,)}</p>

    </div>
  )
}

export default App