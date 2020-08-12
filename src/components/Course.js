import React from 'react'

const Course = ({ name, parts }) => (
  <div>
    <Header course={name} />
    <Content parts={parts} />
    <Total parts={parts} />
  </div>
)

const Header = ({ course }) => {

  return <h1>{course}</h1>
}
const Total = ({ parts }) => {

  return (
    <p><b>total of {parts.reduce((a, b) => a + b.exercises, 0)} exercises</b> </p>
  )


}
const Part = ({ course }) => {
  //console.log(props)
  return <p>{course.name} {course.exercises}</p>

}
const Content = ({ parts }) => {
  return (
    <div>
      {
        parts.map(part => {

          return <Part key={part.id} course={part} />
        })

      }

    </div>
  )
}

export default Course