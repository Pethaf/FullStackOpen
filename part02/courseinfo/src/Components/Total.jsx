const Total = ({parts}) => {
    return <p>Total number of exercises {parts.reduce((acummulator,currentValue) => acummulator+currentValue.exercises,0)}</p>
}

export {Total}