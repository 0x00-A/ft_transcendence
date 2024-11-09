import css from './CheckBox.module.css'

const CheckBox = ({checked=false}:{checked?: boolean}) => {
    if (checked) {
    return (
        <input className={`${css['form-control']}`} type="checkbox" name="checkbox" checked disabled />
    )
    }
    // return (<label className={`${css['form-control']} ${css['form-control--disabled']}`}>
    //     <input type="checkbox" name="checkbox" disabled />
    //     </label>
    // )
    return (
        <input className={`${css['form-control']}`} type="checkbox" name="checkbox" disabled />
    )
}

export default CheckBox