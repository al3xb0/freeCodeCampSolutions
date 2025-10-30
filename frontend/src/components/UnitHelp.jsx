function UnitHelp() {
    return (
        <div className="unit-help" style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>Supported Units</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '5px' }}>Category</th>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '5px' }}>Units</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style={{ padding: '5px' }}>Volume</td>
                    <td style={{ padding: '5px' }}>gal, L</td>
                </tr>
                <tr>
                    <td style={{ padding: '5px' }}>Weight</td>
                    <td style={{ padding: '5px' }}>lbs, kg</td>
                </tr>
                <tr>
                    <td style={{ padding: '5px' }}>Distance</td>
                    <td style={{ padding: '5px' }}>mi, km</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default UnitHelp