import styles from './ProfileCard.module.css';  //cssを読み込む

function ProfileCard({ name, role}) {
    return (
        <div className={styles.card}>
            <div className={styles.avatar}>
                {name[0]}        {/* 名前の1文字目をアイコン代わりに */}
            </div>
            <h2 className={styles.name}>{name}</h2>
            <p>{role}</p>
        </div>
    );
}

export default ProfileCard;  //別ファイルから使えるようにexport