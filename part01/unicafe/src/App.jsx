import { useState } from 'react'

const FeedBackButtonContainer = ({goodClickHandler, neutralClickHandler, badClickHandler}) => {
  return <>
  <h1>give feedback</h1>
  <div>
      <ButtonComponent clickHandler={goodClickHandler} text={"good"} />
      <ButtonComponent clickHandler={neutralClickHandler} text={"neutral"} />
      <ButtonComponent clickHandler={badClickHandler} text={"bad"} />
  </div>
  </>
}

const ButtonComponent = ({text, clickHandler}) => {
  return <button onClick = {clickHandler}>{text}</button>
}
const StatisticsComponent = ({noGood, noNeutral, noBad}) => {
  const totalVotes = noGood+noNeutral+noBad;
  if(noBad == 0 && noGood == 0 && noNeutral == 0){
    return <p> No feedback given</p>
  }
  return <table>
    <thead>
      <tr><th colSpan={2}>Statistics</th></tr>
    </thead>
    <tbody>
    <StatisticsLine value={noGood} text={"Good"}/>
    <StatisticsLine value={noNeutral} text={"Neutral"} />
    <StatisticsLine value={noBad} text={"Bad"} />
    <StatisticsLine value={noGood+noNeutral+noBad} text={"All"} />  
    <StatisticsLine value={(noGood-noBad)/totalVotes} text={"Average"}/>
    <StatisticsLine value={noGood/totalVotes} text={"Positive"} />
    </tbody>
  </table>

}
const StatisticsLine = ({text, value}) => {
  return <tr><td>{text}</td><td>{value}</td></tr>
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <FeedBackButtonContainer goodClickHandler={() => setGood(good+1)} 
                               neutralClickHandler={() => setNeutral(neutral+1)} 
                              badClickHandler={() => setBad(bad+1)}/>
      <StatisticsComponent noGood = {good} noNeutral = {neutral}  noBad={bad}/>
    </div>
  )
}

export default App
