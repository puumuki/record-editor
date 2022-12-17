import styles from './Spinner.module.css'

export default function Spinner(): React.ReactElement {
  return (
    <div className={styles.spinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
