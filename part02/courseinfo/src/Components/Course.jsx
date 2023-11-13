import { Header } from "./Header"
import { Content } from "./Content"
import { Total } from "./Total"
const Course = ({courses}) => {
return (
    <div>
        <header>
            <h1>Web Development Curiculum</h1>
        </header>
        {courses.map(course => {
            return <div key={course.id}>
            <Header {...course} />
            <Content {...course}/>
            <Total {...course} />
             </div>
        })}        
    </div>
    )
}

export { Course }