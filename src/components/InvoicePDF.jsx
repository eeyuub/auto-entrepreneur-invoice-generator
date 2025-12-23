import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 20,
  },
  headerLeft: {
    width: '60%',
  },
  headerRight: {
    width: '35%',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b', // Slate 800
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#0f172a',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 20,
  },
  box: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    borderRadius: 4,
    width: '48%',
    backgroundColor: '#f8fafc',
  },
  boxTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 9,
    color: '#64748b',
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
  },
  colDesc: { width: '50%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  
  totalSection: {
    marginTop: 10,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
    width: '50%',
  },
  totalLabel: {
    width: '50%',
    textAlign: 'right',
    marginRight: 10,
    color: '#64748b',
  },
  totalValue: {
    width: '40%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#1e293b',
    width: '50%',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'right',
    marginRight: 10,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    width: '40%',
    textAlign: 'right',
  },
  amountInWords: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  amountLabel: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  amountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  legalText: {
    fontSize: 8,
    color: '#94a3b8',
    marginBottom: 4,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  signatureBox: {
    width: 150,
    height: 80,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    padding: 8,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
});

const InvoicePDF = ({ data }) => {
  const {
    myInfo,
    clientInfo,
    docSettings,
    items,
    total,
    totalInWords
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>{myInfo.name}</Text>
            <Text>{myInfo.address}</Text>
            <Text>Tél: {myInfo.phone}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>{docSettings.type}</Text>
            <Text style={{ fontSize: 12 }}>N° {docSettings.number}</Text>
            <Text style={{ color: '#64748b', marginTop: 4 }}>Date: {docSettings.date}</Text>
          </View>
        </View>

        {/* Info Boxes */}
        <View style={styles.subHeader}>
          {/* My Info */}
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Émetteur (Auto-Entrepreneur)</Text>
            <View style={styles.row}>
              <Text style={styles.label}>ICE:</Text>
              <Text>{myInfo.ice}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>IF:</Text>
              <Text>{myInfo.if}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>T.P / AE:</Text>
              <Text>{myInfo.aeId}</Text>
            </View>
          </View>

          {/* Client Info */}
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Client</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{clientInfo.name}</Text>
            <Text style={{ marginBottom: 4 }}>{clientInfo.address}</Text>
            {clientInfo.phone && (
                <View style={styles.row}>
                    <Text style={styles.label}>Tél:</Text>
                    <Text>{clientInfo.phone}</Text>
                </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>ICE:</Text>
              <Text>{clientInfo.ice || 'N/A'}</Text>
            </View>
            {clientInfo.if && (
                <View style={styles.row}>
                    <Text style={styles.label}>IF:</Text>
                    <Text>{clientInfo.if}</Text>
                </View>
            )}
            {clientInfo.taxePro && (
                <View style={styles.row}>
                    <Text style={styles.label}>T.P:</Text>
                    <Text>{clientInfo.taxePro}</Text>
                </View>
            )}
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Description</Text>
            <Text style={styles.colQty}>Qté</Text>
            <Text style={styles.colPrice}>P.U (DH)</Text>
            <Text style={styles.colTotal}>Total (DH)</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc' }]}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{Number(item.price).toFixed(2)}</Text>
              <Text style={styles.colTotal}>{(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT:</Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} DH</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA (0%):</Text>
            <Text style={styles.totalValue}>0.00 DH</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total Net à Payer:</Text>
            <Text style={styles.grandTotalValue}>{total.toFixed(2)} DH</Text>
          </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.amountInWords}>
          <Text style={styles.amountLabel}>Arrêté la présente {docSettings.type.toLowerCase()} à la somme de :</Text>
          <Text style={styles.amountText}>{totalInWords}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Cachet et Signature</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.legalText, { fontWeight: 'bold', color: '#64748b' }]}>
            Exonéré de la TVA en vertu de l'article 91 du Code Général des Impôts.
          </Text>
          <Text style={styles.legalText}>
            {myInfo.name} - Auto-Entrepreneur | ICE: {myInfo.ice} | IF: {myInfo.if}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
