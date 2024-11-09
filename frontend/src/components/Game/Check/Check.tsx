import css from './Check.module.css'

const Check = () => {
  return (
    <div className={css.successCheckmark}>
        <div className={css.checkIcon}>
        <span className={`${css.iconLine} ${css.lineTip}`}></span>
        <span className={`${css.iconLine} ${css.lineLong}`}></span>
        <div className={css.iconFix}></div>
        </div>
    </div>
  )
}

export default Check