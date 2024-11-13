import css from './CheckBox.module.css'

const CheckBox = ({checked=false}:{checked?: boolean}) => {
    if (checked) {
    return (
        <input className={`${css['form-control']}`} type="checkbox" name="checkbox" checked disabled />
    )
    }
    return (
        <input className={`${css['form-control']}`} type="checkbox" name="checkbox" disabled />
    )
}

export default CheckBox