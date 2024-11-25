'use client'
import { FormItem, Input, Modal } from '@/components'
import InputDropdown from '@/components/InputDropdown'
import { Dispatch, SetStateAction, useState } from 'react'
import axiosInstance from '@/utils/axiosInstance'
import { useMutation } from '@tanstack/react-query'
import { baseUrl } from '../../../UploadBankStatement/UploadBankStatement'
import { API_URL } from '@/constants/apiUrl'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useParams } from 'next/navigation'
import { ITransactionItem } from '../../TransactionList'

const bankOptions = [
  {
    bank_code: '014',
    pt: 'PT. BANK CENTRAL ASIA, TBK.',
    swift_code: 'CENAIDJA',
    label: 'Bank Central Asia (BCA)',
    id: 'BCA',
  },
  {
    bank_code: '008',
    pt: 'PT. BANK MANDIRI, TBK.',
    swift_code: 'BMRIIDJA',
    label: 'Bank Mandiri',
    id: 'Mandiri ',
  },
  {
    bank_code: '002',
    pt: 'PT. BANK RAKYAT INDONESIA, TBK.',
    swift_code: 'BRINIDJA',
    label: 'Bank Rakyat Indonesia (BRI)',
    id: 'BRI',
  },
  {
    bank_code: '009',
    pt: 'PT. BANK NEGARA INDONESIA, TBK.',
    swift_code: 'BNINIDJA',
    label: 'Bank Negara Indonesia (BNI)',
    id: 'BNI',
  },
  {
    bank_code: '011',
    pt: 'PT. BANK DANAMON INDONESIA, TBK.',
    swift_code: 'BDINIDJA',
    label: 'Bank Danamon',
    id: 'DANAMON',
  },
  {
    bank_code: '013',
    pt: 'PT. BANK PERMATA, TBK.',
    swift_code: 'BBBAIDJA',
    label: 'Bank Permata',
    id: 'PERMATA',
  },
  {
    bank_code: '019',
    pt: 'PT. BANK PANIN',
    swift_code: 'PINBIDJA',
    label: 'Bank Panin',
    id: 'PANIN',
  },
  {
    bank_code: '517',
    pt: 'PT. BANK PANIN DUBAI SYARIAH',
    swift_code: 'ARFAIDJ1',
    label: 'Bank Panin Syariah',
    id: 'PANIN_SYR',
  },
  {
    bank_code: '153',
    pt: 'PT. BANK SINARMAS',
    swift_code: 'SBJKIDJA',
    label: 'Bank Sinarmas',
    id: 'SINARMAS',
  },
  {
    bank_code: '734',
    pt: 'PT. BANK SINARMAS UNIT USAHA SYARIAH',
    swift_code: 'SYTBIDJ1',
    label: 'Bank Sinarmas UUS',
    id: 'SINARMAS_UUS',
  },
  {
    bank_code: '531',
    pt: 'PT. ANGLOMAS INTERNATIONAL BANK',
    swift_code: 'LOMAIDJ1',
    label: 'Anglomas International Bank',
    id: 'ANGLOMAS',
  },
  {
    bank_code: '531',
    pt: 'PT. BANK AMAR INDONESIA',
    swift_code: 'LOMAIDJ1',
    label: 'Bank Amar Indonesia',
    id: 'AMAR',
  },
  {
    bank_code: '040',
    pt: 'BANGKOK BANK PUBLIC CO. LTD.',
    swift_code: 'BKKBIDJA',
    label: 'Bangkok Bank',
    id: 'BANGKOK',
  },
  {
    bank_code: '494',
    pt: 'PT. BANK BRI AGRONIAGA TBK.',
    swift_code: 'AGTBIDJA',
    label: 'Bank BRI Agroniaga',
    id: 'AGRONIAGA',
  },
  {
    bank_code: '061',
    pt: 'PT. BANK ANZ INDONESIA',
    swift_code: 'ANZBIDJX',
    label: 'Bank ANZ Indonesia',
    id: 'ANZ',
  },
  {
    bank_code: '037',
    pt: 'PT. BANK ARTHA GRAHA INTERNATIONAL, TBK.',
    swift_code: 'ARTGIDJA',
    label: 'Bank Artha Graha International',
    id: 'ARTHA',
  },
  {
    bank_code: '542',
    pt: 'PT. BANK ARTOS INDONESIA',
    swift_code: 'ATOSIDJ1',
    label: 'Bank Artos Indonesia',
    id: 'ARTOS',
  },
  {
    bank_code: '459',
    pt: 'PT. BANK BISNIS INTERNASIONAL',
    swift_code: 'BUSTIDJ1',
    label: 'Bank Bisnis Internasional',
    id: 'BISNIS_INTERNASIONAL',
  },
  {
    bank_code: '110',
    pt: 'PT. BANK BJB',
    swift_code: 'PDJBIDJA',
    label: 'Bank BJB',
    id: 'BJB',
  },
  {
    bank_code: '057',
    pt: 'PT. BANK BNP PARIBAS INDONESIA',
    swift_code: 'BNPAIDJA',
    label: 'Bank BNP Paribas',
    id: 'BNP_PARIBAS',
  },
  {
    bank_code: '441',
    pt: 'PT. BANK BUKOPIN',
    swift_code: 'BBUKIDJA',
    label: 'Bank Bukopin',
    id: 'BUKOPIN',
  },
  {
    bank_code: '076',
    pt: 'PT. BANK BUMI ARTA',
    swift_code: 'BBAIIDJA',
    label: 'Bank Bumi Arta',
    id: 'BUMI_ARTA',
  },
  {
    bank_code: '054',
    pt: 'PT. BANK CAPITAL INDONESIA',
    swift_code: 'BCIAIDJA',
    label: 'Bank Capital Indonesia',
    id: 'CAPITAL',
  },
  {
    bank_code: '949',
    pt: 'PT. BANK CHINATRUST INDONESIA',
    swift_code: 'CTCBIDJA',
    label: 'Bank Chinatrust Indonesia',
    id: 'CHINATRUST',
  },
  {
    bank_code: '950',
    pt: 'PT. BANK COMMONWEALTH',
    swift_code: 'BICNIDJA',
    label: 'Bank Commonwealth',
    id: 'COMMONWEALTH',
  },
  {
    bank_code: '011',
    pt: 'PT. BANK DANAMON INDONESIA, TBK. UUS',
    swift_code: 'SYBDIDJ1',
    label: 'Bank Danamon UUS',
    id: 'DANAMON_UUS',
  },
  {
    bank_code: '046',
    pt: 'PT. BANK DBS INDONESIA',
    swift_code: 'DBSBIDJA',
    label: 'Bank DBS Indonesia',
    id: 'DBS',
  },
  {
    bank_code: '526',
    pt: 'PT. BANK DINAR INDONESIA',
    swift_code: 'LMANIDJ1',
    label: 'Bank Dinar Indonesia',
    id: 'DINAR_INDONESIA',
  },
  {
    bank_code: '111',
    pt: 'PT. BANK DKI',
    swift_code: 'BDKIIDJA',
    label: 'Bank DKI',
    id: 'DKI',
  },
  {
    bank_code: '111',
    pt: 'PT. BANK DKI. UUS',
    swift_code: 'SYDKIDJ1',
    label: 'Bank DKI UUS',
    id: 'DKI_UUS',
  },
  {
    bank_code: '562',
    pt: 'PT. BANK FAMA INTERNATIONAL',
    swift_code: 'FAMAIDJ1',
    label: 'Bank Fama International',
    id: 'FAMA',
  },
  {
    bank_code: '161',
    pt: 'PT. BANK GANESHA',
    swift_code: 'GNESIDJA',
    label: 'Bank Ganesha',
    id: 'GANESHA',
  },
  {
    bank_code: '567',
    pt: 'PT. BANK HARDA INTERNASIONAL',
    swift_code: 'HRDAIDJ1',
    label: 'Bank Harda Internasional',
    id: 'HARDA_INTERNASIONAL',
  },
  {
    bank_code: '513',
    pt: 'PT. BANK INA PERDANA',
    swift_code: 'INPBIDJ1',
    label: 'Bank Ina Perdania',
    id: 'INA_PERDANA',
  },
  {
    bank_code: '555',
    pt: 'PT. BANK INDEX SELINDO',
    swift_code: 'BIDXIDJA',
    label: 'Bank Index Selindo',
    id: 'INDEX_SELINDO',
  },
  {
    bank_code: '016',
    pt: 'PT. BANK MAYBANK INDONESIA TBK.',
    swift_code: 'IBBKIDJA',
    label: 'Bank Maybank',
    id: 'MAYBANK',
  },
  {
    bank_code: '016',
    pt: 'PT. BANK MAYBANK INDONESIA SYRIAH TBK.',
    swift_code: 'MBBEIDJA',
    label: 'Bank Maybank Syariah Indonesia',
    id: 'MAYBANK_SYR',
  },
  {
    bank_code: '472',
    pt: 'PT. BANK JASA JAKARTA',
    swift_code: 'JAJSIDJ1',
    label: 'Bank Jasa Jakarta',
    id: 'JASA_JAKARTA',
  },
  {
    bank_code: '535',
    pt: 'PT. BANK KESEJAHTERAAN EKONOMI',
    swift_code: 'KSEBIDJ1',
    label: 'Bank Kesejahteraan Ekonomi',
    id: 'KESEJAHTERAAN_EKONOMI',
  },
  {
    bank_code: '157',
    pt: 'PT. BANK MASPION INDONESIA',
    swift_code: 'MASDIDJS',
    label: 'Bank Maspion Indonesia',
    id: 'MASPION',
  },
  {
    bank_code: '097',
    pt: 'PT. BANK MAYAPADA INTERNATIONAL, TBK.',
    swift_code: 'MAYAIDJA',
    label: 'Bank Mayapada International',
    id: 'MAYAPADA',
  },
  {
    bank_code: '553',
    pt: 'PT. BANK MAYORA',
    swift_code: 'MAYOIDJA',
    label: 'Bank Mayora',
    id: 'MAYORA',
  },
  {
    bank_code: '426',
    pt: 'PT. BANK MEGA, TBK.',
    swift_code: 'MEGAIDJA',
    label: 'Bank Mega',
    id: 'MEGA',
  },
  {
    bank_code: '151',
    pt: 'PT. BANK MESTIKA DHARMA',
    swift_code: 'MEDHIDS1',
    label: 'Bank Mestika Dharma',
    id: 'MESTIKA_DHARMA',
  },
  {
    bank_code: '152',
    pt: 'PT. BANK SHINHAN INDONESIA',
    swift_code: 'MEEKIDJ1',
    label: 'Bank Shinhan Indonesia',
    id: 'SHINHAN',
  },
  {
    bank_code: '491',
    pt: 'PT. BANK MITRA NIAGA',
    swift_code: 'MGABIDJ1',
    label: 'Bank Mitra Niaga',
    id: 'MITRA_NIAGA',
  },
  {
    bank_code: '048',
    pt: 'PT. BANK MIZUHO INDONESIA',
    swift_code: 'MHCCIDJA',
    label: 'Bank Mizuho Indonesia',
    id: 'MIZUHO',
  },
  {
    bank_code: '147',
    pt: 'PT. BANK MUAMALAT INDONESIA TBK',
    swift_code: 'MUABIDJA',
    label: 'Bank Muamalat Indonesia',
    id: 'MUAMALAT',
  },
  {
    bank_code: '548',
    pt: 'PT. BANK MULTI ARTA SENTOSA',
    swift_code: 'BMSEIDJA',
    label: 'Bank Multi Arta Sentosa',
    id: 'MULTI_ARTA_SENTOSA',
  },
  {
    bank_code: '145',
    pt: 'PT. BANK NUSANTARA PARAHYANGAN',
    swift_code: 'NUPAIDJ6',
    label: 'Bank Nusantara Parahyangan',
    id: 'NUSANTARA_PARAHYANGAN',
  },
  {
    bank_code: '028',
    pt: 'PT. BANK OCBC NISP, TBK.',
    swift_code: 'NISPIDJA',
    label: 'Bank OCBC NISP',
    id: 'OCBC',
  },
  {
    bank_code: '028',
    pt: 'PT. BANK OCBC NISP, TBK. UUS',
    swift_code: 'SYONIDJ1',
    label: 'Bank OCBC NISP UUS',
    id: 'OCBC_UUS',
  },
  {
    bank_code: '033',
    pt: 'BANK OF AMERICA MERRILL-LYNCH',
    swift_code: 'BOFAID2X',
    label: 'Bank of America Merill-Lynch',
    id: 'BAML',
  },
  {
    bank_code: '069',
    pt: 'BANK OF CHINA LIMITED',
    swift_code: 'BKCHIDJA',
    label: 'Bank of China (BOC)',
    id: 'BOC',
  },
  {
    bank_code: '042',
    pt: 'BANK OF TOKYO MITSUBISHI UFJ, LTD.',
    swift_code: 'BOTKIDJX',
    label: 'Bank of Tokyo Mitsubishi UFJ',
    id: 'TOKYO',
  },
  {
    bank_code: '013',
    pt: 'PT. BANK PERMATA, TBK. UUS',
    swift_code: 'SYBBIDJ1',
    label: 'Bank Permata UUS',
    id: 'PERMATA_UUS',
  },
  {
    bank_code: '089',
    pt: 'PT. BANK RABOBANK INTERNATIONAL INDONESIA',
    swift_code: 'RABOIDJA',
    label: 'Bank Rabobank International Indonesia',
    id: 'RABOBANK',
  },
  {
    bank_code: '047',
    pt: 'PT. BANK RESONA PERDANIA',
    swift_code: 'BPIAIDJA',
    label: 'Bank Resona Perdania',
    id: 'RESONA',
  },
  {
    bank_code: '501',
    pt: 'PT. BANK ROYAL INDONESIA',
    swift_code: 'ROYBIDJ1',
    label: 'Bank Royal Indonesia',
    id: 'ROYAL',
  },
  {
    bank_code: '564',
    pt: 'PT. BANK MANDIRI TASPEN POS',
    swift_code: 'SIHBIDJ1',
    label: 'Mandiri Taspen Pos',
    id: 'MANDIRI_TASPEN',
  },
  {
    bank_code: '045',
    pt: 'PT. BANK SUMITOMO MITSUI INDONESIA',
    swift_code: 'SUNIIDJA',
    label: 'Bank Sumitomo Mitsui Indonesia',
    id: 'MITSUI',
  },
  {
    bank_code: '451',
    pt: 'PT. BANK SYARIAH MANDIRI',
    swift_code: 'BSMDIDJA',
    label: 'Bank Syariah Mandiri',
    id: 'MANDIRI_SYR',
  },
  {
    bank_code: '506',
    pt: 'PT. BANK SYARIAH MEGA INDONESIA',
    swift_code: 'BUTGIDJ1',
    label: 'Bank Syariah Mega',
    id: 'MEGA_SYR',
  },
  {
    bank_code: '200',
    pt: 'PT. BANK TABUNGAN NEGARA, TBK.',
    swift_code: 'BTANIDJA',
    label: 'Bank Tabungan Negara (BTN)',
    id: 'BTN',
  },
  {
    bank_code: '200',
    pt: 'PT. BANK TABUNGAN NEGARA, TBK. UUS',
    swift_code: 'SYBTIDJ1',
    label: 'Bank Tabungan Negara (BTN) UUS',
    id: 'BTN_UUS',
  },
  {
    bank_code: '213',
    pt: 'PT. BANK TABUNGAN PENSIUNAN NASIONAL',
    swift_code: 'BTPNIDJA',
    label: 'Bank Tabungan Pensiunan Nasional (BTPN)',
    id: 'TABUNGAN_PENSIUNAN_NASIONAL',
  },
  {
    bank_code: '023',
    pt: 'PT. BANK UOB INDONESIA',
    swift_code: 'BBIJIDJA',
    label: 'Bank UOB Indonesia',
    id: 'UOB',
  },
  {
    bank_code: '566',
    pt: 'PT. BANK VICTORIA INTERNASIONAL',
    swift_code: 'BVICIDJA',
    label: 'Bank Victoria Internasional',
    id: 'VICTORIA_INTERNASIONAL',
  },
  {
    bank_code: '068',
    pt: 'PT. BANK WOORI SAUDARA ,TBK.',
    swift_code: 'HVBKIDJA',
    label: 'Bank Woori Indonesia',
    id: 'WOORI',
  },
  {
    bank_code: '490',
    pt: 'PT. BANK YUDHA BHAKTI',
    swift_code: 'YUDBIDJ1',
    label: 'Bank Yudha Bhakti',
    id: 'YUDHA_BHAKTI',
  },
  {
    bank_code: '116',
    pt: 'PT. BPD ACEH',
    swift_code: 'PDACIDJ1',
    label: 'BPD Aceh',
    id: 'ACEH',
  },
  {
    bank_code: '116',
    pt: 'PT. BPD ACEH. UUS',
    swift_code: 'SYACIDJ1',
    label: 'BPD Aceh UUS',
    id: 'ACEH_UUS',
  },
  {
    bank_code: '129',
    pt: 'PT. BPD BALI',
    swift_code: 'ABALIDBS',
    label: 'BPD Bali',
    id: 'BALI',
  },
  {
    bank_code: '133',
    pt: 'PT. BPD BENGKULU',
    swift_code: 'PDBKIDJ1',
    label: 'BPD Bengkulu',
    id: 'BENGKULU',
  },
  {
    bank_code: '112',
    pt: 'PT. BPD DAERAH ISTIMEWA YOGYAKARTA',
    swift_code: 'PDYKIDJ1',
    label: 'BPD Daerah Istimewa Yogyakarta (DIY)',
    id: 'DAERAH_ISTIMEWA',
  },
  {
    bank_code: '112',
    pt: 'PT. BPD DAERAH ISTIMEWA YOGYAKARTA. UUS',
    swift_code: 'SYYKIDJ1',
    label: 'BPD Daerah Istimewa Yogyakarta (DIY) UUS',
    id: 'DAERAH_ISTIMEWA_UUS',
  },
  {
    bank_code: '115',
    pt: 'PT. BPD JAMBI',
    swift_code: 'PDJMIDJ1',
    label: 'BPD Jambi',
    id: 'JAMBI',
  },
  {
    bank_code: '115',
    pt: 'PT. BPD JAMBI. UUS',
    swift_code: 'SYJMIDJ1',
    label: 'BPD Jambi UUS',
    id: 'JAMBI_UUS',
  },
  {
    bank_code: '113',
    pt: 'PT. BPD JAWA TENGAH',
    swift_code: 'PDJGIDJ1',
    label: 'BPD Jawa Tengah',
    id: 'JAWA_TENGAH',
  },
  {
    bank_code: '113',
    pt: 'PT. BPD JAWA TENGAH. UUS',
    swift_code: 'SYJGIDJ1',
    label: 'BPD Jawa Tengah UUS',
    id: 'JAWA_TENGAH_UUS',
  },
  {
    bank_code: '114',
    pt: 'PT. BPD JAWA TIMUR',
    swift_code: 'PDJTIDJ1',
    label: 'BPD Jawa Timur',
    id: 'JAWA_TIMUR',
  },
  {
    bank_code: '114',
    pt: 'PT. BPD JAWA TIMUR. UUS',
    swift_code: 'SYJTIDJ1',
    label: 'BPD Jawa Timur UUS',
    id: 'JAWA_TIMUR_UUS',
  },
  {
    bank_code: '123',
    pt: 'PT. BPD KALIMANTAN BARAT',
    swift_code: 'PDKBIDJ1',
    label: 'BPD Kalimantan Barat',
    id: 'KALIMANTAN_BARAT',
  },
  {
    bank_code: '123',
    pt: 'PT. BPD KALIMANTAN BARAT. UUS',
    swift_code: 'SYKBIDJ1',
    label: 'BPD Kalimantan Barat UUS',
    id: 'KALIMANTAN_BARAT_UUS',
  },
  {
    bank_code: '122',
    pt: 'PT. BPD KALIMANTAN SELATAN',
    swift_code: 'PDKSIDJ1',
    label: 'BPD Kalimantan Selatan',
    id: 'KALIMANTAN_SELATAN',
  },
  {
    bank_code: '122',
    pt: 'PT. BPD KALIMANTAN SELATAN. UUS',
    swift_code: 'SYKSIDJ1',
    label: 'BPD Kalimantan Selatan UUS',
    id: 'KALIMANTAN_SELATAN_UUS',
  },
  {
    bank_code: '125',
    pt: 'PT. BPD KALIMANTAN TENGAH',
    swift_code: 'PDKGIDJ1',
    label: 'BPD Kalimantan Tengah',
    id: 'KALIMANTAN_TENGAH',
  },
  {
    bank_code: '124',
    pt: 'PT. BPD KALIMANTAN TIMUR',
    swift_code: 'PDKTIDJ1',
    label: 'BPD Kalimantan Timur',
    id: 'KALIMANTAN_TIMUR',
  },
  {
    bank_code: '124',
    pt: 'PT. BPD KALIMANTAN TIMUR. UUS',
    swift_code: 'SYKTIDJ1',
    label: 'BPD Kalimantan Timur UUS',
    id: 'KALIMANTAN_TIMUR_UUS',
  },
  {
    bank_code: '121',
    pt: 'PT. BPD LAMPUNG',
    swift_code: 'PDLPIDJ1',
    label: 'BPD Lampung',
    id: 'LAMPUNG',
  },
  {
    bank_code: '131',
    pt: 'PT. BPD MALUKU',
    swift_code: 'PDMLIDJ1',
    label: 'BPD Maluku',
    id: 'MALUKU',
  },
  {
    bank_code: '128',
    pt: 'PT. BPD NUSA TENGGARA BARAT',
    swift_code: 'PDNBIDJ1',
    label: 'BPD Nusa Tenggara Barat',
    id: 'NUSA_TENGGARA_BARAT',
  },
  {
    bank_code: '128',
    pt: 'PT. BPD NUSA TENGGARA BARAT. UUS',
    swift_code: 'SYNBIDJ1',
    label: 'BPD Nusa Tenggara Barat UUS',
    id: 'NUSA_TENGGARA_BARAT_UUS',
  },
  {
    bank_code: '130',
    pt: 'PT. BPD NUSA TENGGARA TIMUR',
    swift_code: 'PDNTIDJ1',
    label: 'BPD Nusa Tenggara Timur',
    id: 'NUSA_TENGGARA_TIMUR',
  },
  {
    bank_code: '132',
    pt: 'PT. BPD PAPUA',
    swift_code: 'PDIJIDJ1',
    label: 'BPD Papua',
    id: 'PAPUA',
  },
  {
    bank_code: '119',
    pt: 'PT. BPD RIAU DAN KEPRI',
    swift_code: 'PDRIIDJA',
    label: 'BPD Riau Dan Kepri',
    id: 'RIAU_DAN_KEPRI',
  },
  {
    bank_code: '119',
    pt: 'PT. BPD RIAU DAN KEPRI. UUS',
    swift_code: 'SYRIIDJ1',
    label: 'BPD Riau Dan Kepri UUS',
    id: 'RIAU_DAN_KEPRI_UUS',
  },
  {
    bank_code: '134',
    pt: 'PT. BPD SULAWESI TENGAH',
    swift_code: 'PDWGIDJ1',
    label: 'BPD Sulawesi Tengah',
    id: 'SULAWESI',
  },
  {
    bank_code: '135',
    pt: 'PT. BPD SULAWESI TENGGARA',
    swift_code: 'PDWRIDJ1',
    label: 'BPD Sulawesi Tenggara',
    id: 'SULAWESI_TENGGARA',
  },
  {
    bank_code: '126',
    pt: 'PT. BPD SULSELBAR',
    swift_code: 'PDWSIDJ1',
    label: 'BPD Sulselbar',
    id: 'SULSELBAR',
  },
  {
    bank_code: '126',
    pt: 'PT. BPD SULSELBAR. UUS',
    swift_code: 'SYWSIDJ1',
    label: 'BPD Sulselbar UUS',
    id: 'SULSELBAR_UUS',
  },
  {
    bank_code: '127',
    pt: 'PT. BPD SULUT',
    swift_code: 'PDWUIDJ1',
    label: 'BPD Sulut',
    id: 'SULUT',
  },
  {
    bank_code: '118',
    pt: 'PT. BPD SUMATERA BARAT',
    swift_code: 'PDSBIDSP',
    label: 'BPD Sumatera Barat',
    id: 'SUMATERA_BARAT',
  },
  {
    bank_code: '118',
    pt: 'PT. BPD SUMATERA BARAT. UUS',
    swift_code: 'SYSBIDJ1',
    label: 'BPD Sumatera Barat UUS',
    id: 'SUMATERA_BARAT_UUS',
  },
  {
    bank_code: '120',
    pt: 'PT. BPD SUMSEL DAN BABEL',
    swift_code: 'BSSPIDSP',
    label: 'BPD Sumsel Dan Babel',
    id: 'SUMSEL_DAN_BABEL',
  },
  {
    bank_code: '120',
    pt: 'PT. BPD SUMSEL DAN BABEL. UUS',
    swift_code: 'SYSSIDJ1',
    label: 'BPD Sumsel Dan Babel UUS',
    id: 'SUMSEL_DAN_BABEL_UUS',
  },
  {
    bank_code: '117',
    pt: 'PT. BPD SUMUT',
    swift_code: 'PDSUIDJ1',
    label: 'BPD Sumut',
    id: 'SUMUT',
  },
  {
    bank_code: '117',
    pt: 'PT. BPD SUMUT. UUS',
    swift_code: 'SYSUIDJ1',
    label: 'BPD Sumut UUS',
    id: 'SUMUT_UUS',
  },
  {
    bank_code: '559',
    pt: 'PT. CENTRATAMA NASIONAL BANK',
    swift_code: 'CNBAIDJ1',
    label: 'Centratama Nasional Bank',
    id: 'CENTRATAMA',
  },
  {
    bank_code: '031',
    pt: 'CITIBANK N.A.',
    swift_code: 'CITIIDJX',
    label: 'Citibank',
    id: 'CITIBANK',
  },
  {
    bank_code: '067',
    pt: 'DEUTSCHE BANK AG',
    swift_code: 'DEUTIDJA',
    label: 'Deutsche Bank',
    id: 'DEUTSCHE',
  },
  {
    bank_code: '087',
    pt: 'HONGKONG AND SHANGHAI BANK CORPORATION',
    swift_code: 'HSBCIDJA',
    label: 'HSBC Indonesia',
    id: 'HSBC',
  },
  {
    bank_code: '087',
    pt: 'HONGKONG AND SHANGHAI BANK CORPORATION. UUS',
    swift_code: 'HSBCIDJA',
    label: 'Hongkong and Shanghai Bank Corporation (HSBC) UUS',
    id: 'HSBC_UUS',
  },
  {
    bank_code: '032',
    pt: 'JP MORGAN CHASE BANK, N.A',
    swift_code: 'CHASIDJX',
    label: 'JP Morgan Chase Bank',
    id: 'JPMORGAN',
  },
  {
    bank_code: '520',
    pt: 'PT. PRIMA MASTER BANK',
    swift_code: 'PMASIDJ1',
    label: 'Prima Master Bank',
    id: 'PRIMA_MASTER',
  },
  {
    bank_code: '050',
    pt: 'STANDARD CHARTERED BANK',
    swift_code: 'SCBLIDJX',
    label: 'Standard Charted Bank',
    id: 'STANDARD_CHARTERED',
  },
  {
    bank_code: '003',
    pt: 'BANK EKSPOR INDONESIA',
    swift_code: 'LPEIIDJ1',
    label: 'Indonesia Eximbank',
    id: 'EXIMBANK',
  },
  {
    bank_code: '020',
    pt: 'BANK ARTA NIAGA KENCANA',
    label: 'Bank Arta Niaga Kencana',
    id: 'ARTA_NIAGA_KENCANA',
    swift_code: 'ARNKIDJ1',
  },
  {
    bank_code: '164',
    pt: 'PT. BANK ICBC INDONESIA',
    swift_code: 'ICBKIDJA',
    label: 'Bank ICBC Indonesia',
    id: 'ICBC',
  },
  {
    bank_code: '212',
    pt: 'BANK HIMPUNAN SAUDARA 1906, TBK',
    swift_code: 'HVBKIDJA',
    label: 'Bank Himpunan Saudara 1906',
    id: 'HIMPUNAN_SAUDARA',
  },
  {
    bank_code: '212',
    pt: 'PT. BANK WOORI SAUDARA INDONESIA 1906, TBK',
    swift_code: 'HVBKIDJA',
    label: 'Bank Woori Saudara Indonesia 1906',
    id: 'WOORI_SAUDARA',
  },
  {
    bank_code: '503',
    pt: 'BANK NATIONALNOBU',
    swift_code: 'LFIBIDJ1',
    label: 'Bank Nationalnobu',
    id: 'NATIONALNOBU',
  },
  {
    bank_code: '022',
    pt: 'PT. BANK CIMB NIAGA, TBK',
    swift_code: 'BNIAIDJA',
    label: 'Bank CIMB Niaga',
    id: 'CIMB',
  },
  {
    bank_code: '022',
    pt: 'PT. BANK CIMB NIAGA, TBK. UUS',
    swift_code: 'SYNAIDJ1',
    label: 'Bank CIMB Niaga UUS',
    id: 'CIMB_UUS',
  },
  {
    bank_code: '536',
    pt: 'PT. BANK BCA SYARIAH',
    swift_code: 'SYCAIDJ1',
    label: 'Bank Central Asia (BCA) Syariah',
    id: 'BCA_SYR',
  },
  {
    bank_code: '427',
    pt: 'PT. BANK BNI SYARIAH',
    swift_code: 'SYNIIDJ1',
    label: 'Bank BNI Syariah',
    id: 'BNI_SYR',
  },
  {
    bank_code: '425',
    pt: 'PT. BANK BJB SYARIAH',
    swift_code: 'SYJBIDJ1',
    label: 'Bank BJB Syariah',
    id: 'BJB_SYR',
  },
  {
    bank_code: '422',
    pt: 'PT. BANK SYARIAH BRI',
    swift_code: 'DJARIDJ1',
    label: 'Bank Syariah BRI',
    id: 'BRI_SYR',
  },
  {
    bank_code: '521',
    pt: 'PT. BANK SYARIAH BUKOPIN',
    swift_code: 'SDOBIDJ1',
    label: 'Bank Syariah Bukopin',
    id: 'BUKOPIN_SYR',
  },
  {
    bank_code: '405',
    pt: 'PT. BANK VICTORIA SYARIAH',
    swift_code: 'SWAGIDJ1',
    label: 'Bank Victoria Syariah',
    id: 'VICTORIA_SYR',
  },
  {
    bank_code: '485',
    pt: 'PT. BANK MNC INTERNASIONAL, TBK.',
    swift_code: 'BUMIIDJA',
    label: 'Bank MNC Internasional',
    id: 'MNC_INTERNASIONAL',
  },
  {
    bank_code: '523',
    pt: 'PT. BANK SAHABAT SAMPOERNA',
    swift_code: 'BDIPIDJ1',
    label: 'Bank Sahabat Sampoerna',
    id: 'SAHABAT_SAMPOERNA',
  },
  {
    bank_code: '167',
    pt: 'PT. BANK QNB INDONESIA',
    swift_code: 'AWANIDJA',
    label: 'Bank QNB Indonesia',
    id: 'QNB_INDONESIA',
  },
  {
    bank_code: '146',
    pt: 'PT. BANK INDIA',
    swift_code: 'BKIDIDJA',
    label: 'Bank of India Indonesia',
    id: 'INDIA',
  },
  {
    bank_code: '137',
    pt: 'PT. BANK PEMBANGUNAN DAERAH BANTEN',
    swift_code: 'PDBBIDJ1',
    label: 'BPD Banten',
    id: 'BANTEN',
  },
  {
    bank_code: '466',
    pt: 'PT. BANK ANDARA',
    swift_code: 'RIPAIDJ1',
    label: 'Bank Andara',
    id: 'ANDARA',
  },
  {
    bank_code: '466',
    pt: 'PT. BANK OKE INDONESIA',
    swift_code: 'RIPAIDJ1',
    label: 'Bank Oke Indonesia',
    id: 'OKE',
  },
  {
    bank_code: '498',
    pt: 'PT. BANK SBI INDONESIA',
    swift_code: 'IDMOIDJ1',
    label: 'Bank SBI Indonesia',
    id: 'SBI_INDONESIA',
  },
  {
    bank_code: '052',
    pt: 'PT. BANK RBS',
    label: 'Royal Bank of Scotland (RBS)',
    id: 'RBS',
    swift_code: 'ABNAIDJA',
  },
  {
    bank_code: '484',
    pt: 'PT. BANK HANA',
    swift_code: 'HNBNIDJA',
    label: 'Bank Hana',
    id: 'HANA',
  },
  {
    bank_code: '945',
    pt: 'PT. BANK AGRIS',
    swift_code: 'AGSSIDJA',
    label: 'Bank Agris',
    id: 'AGRIS',
  },
  {
    bank_code: '095',
    pt: 'PT. BANK J TRUST INDONESIA, TBK.',
    swift_code: 'CICTIDJA',
    label: 'Bank JTrust Indonesia',
    id: 'JTRUST',
  },
  {
    bank_code: '547',
    pt: 'PT. BANK BTPN SYARIAH, TBK.',
    swift_code: 'PUBAIDJ1',
    label: 'BTPN Syariah',
    id: 'BTPN_SYARIAH',
  },
  {
    bank_code: '036',
    pt: 'PT BANK CHINA CONSTRUCTION BANK INDONESIA, TBK.',
    swift_code: 'BWKIIDJA',
    label: 'China Construction Bank Indonesia',
    id: 'CCB',
  },
  {
    bank_code: 'OVO',
    pt: 'OVO (PT Visionet Internasional)',
    swift_code: 'OVO',
    label: 'OVO',
    id: 'EWALLET_OVO',
  },
  {
    bank_code: 'DANA',
    pt: 'DANA (PT. Espay Debit Indonesia)',
    swift_code: 'DANA',
    label: 'DANA',
    id: 'EWALLET_DANA',
  },
  {
    bank_code: 'GOPAY',
    pt: 'GOPAY (PT Aplikasi Karya Anak Bangsa)',
    swift_code: 'GOPAY',
    label: 'GOPAY',
    id: 'EWALLET_GOPAY',
  },
  {
    label: 'Lainnya',
    id: 'other',
  },
]

const validationSchema = yup.object().shape({
  name: yup.string().required('Nama wajib diisi'),
  accountNo: yup.string(),
})

const TransactionBankDestModal = ({
  token,
  isOpen,
  onClose,
  selected,
  setIsOpenDestBankModal,
}: {
  token: string
  isOpen: boolean
  onClose: () => void
  selected: ITransactionItem
  setIsOpenDestBankModal: Dispatch<SetStateAction<boolean>>
}) => {
  const { id } = useParams()
  const [selectedBank, setSelectedBank] = useState({ id: '', label: '' })

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      accountNo: '',
    },
    resolver: yupResolver(validationSchema),
  })

  const { mutate } = useMutation({
    mutationFn: (payload: {
      entity_name?: string
      entity_bank?: string
      entity_account_number?: string
    }) =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${id}/entity`,
        {
          ...payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const { mutate: resetDestBank } = useMutation({
    mutationFn: () =>
      axiosInstance.post(
        `${baseUrl}/${API_URL.UPDATE_TRANSACTION}/${id}/entity/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ),
  })

  const handleUpdate = async (value: { name: string; accountNo?: string }) => {
    mutate(
      {
        entity_name: value.name,
        entity_account_number: value.accountNo,
        entity_bank: selectedBank.id,
      },
      {
        onSuccess: () => {
          toast.success('Berhasil memperbarui info lawan transaksi')
          onClose()
          setSelectedBank({ id: '', label: '' })
        },
        onError: (error: any) => {
          toast.error(
            `Gagal memperbarui info lawan transaksi: ${error?.response?.data?.message}`
          )
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpenDestBankModal(false)}
      width={'w-[600px]'}
    >
      <h2 className="font-semibold text-lg">Sesuaikan Info Lawan Transaksi</h2>
      <div className="mt-2 text-sm mb-4">
        Gunakan form ini untuk mengedit informasi lawan transaksi. Pastikan
        informasi sudah benar sebelum menyimpan perubahan.
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormItem label="Nama" errorMessage={error?.message}>
              <Input
                className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Masukkan nama..."
                {...field}
                errorMessage={error?.message}
              />
            </FormItem>
          )}
        />
        <Controller
          name="accountNo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormItem label="Nomor Lawan Transaksi (opsional)">
              <Input
                className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Masukkan nomor lawan transaksi..."
                {...field}
                errorMessage={error?.message}
              />
            </FormItem>
          )}
        />

        <FormItem label="Institusi Lawan Transaksi (opsional)">
          <InputDropdown
            placeholder="Pilih institusi lawan transaksi..."
            options={bankOptions}
            value={selectedBank}
            onChange={(option) => {
              setSelectedBank(option as { id: string; label: string })
            }}
          />
        </FormItem>

        {selectedBank.id === 'other' && (
          <FormItem label="Nama Institusi Lawan Transaksi (opsional)">
            <Input
              className="w-full px-3 text-sm py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onChange={() => {}}
              placeholder="Masukkan nama institusi lawan transaksi..."
            />
          </FormItem>
        )}

        <div className="text-xs mt-2 text-gray-600">
          {`*Info lawan transaksi awal: ${
            selected.entity_bank || 'unknown'
          } - ${selected.entity_name || 'unnamed'} - ${
            selected.entity_account_number || 'N/A'
          }`}
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={() => {
              setIsOpenDestBankModal(false)
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            className="bg-black text-white font-semibold text-sm px-4 py-2 rounded-md hover:opacity-80"
            onClick={() => {
              resetDestBank(undefined, {
                onSuccess: () => {
                  toast.success(
                    'Berhasil mengatur ulang ke info lawan transaksi awal'
                  )
                  onClose()
                  setSelectedBank({ id: '', label: '' })
                },
                onError: (error: any) => {
                  toast.error(
                    `Gagal mengatur ulang ke info lawan transaksi awal: ${error?.response?.data?.message}`
                  )
                },
              })
            }}
          >
            Atur Ulang ke Info Lawan Transaksi Awal
          </button>

          <button
            onClick={handleSubmit(handleUpdate)}
            className="font-semibold bg-primary text-white items-center p-2 px-6 rounded-md text-sm hover:opacity-95"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TransactionBankDestModal
