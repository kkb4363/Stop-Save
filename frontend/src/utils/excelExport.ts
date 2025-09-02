import * as XLSX from "xlsx";
import type { SavingRecord } from "../types/user";

export const exportToExcel = (records: SavingRecord[], filename?: string) => {
  // Excel 데이터 형식으로 변환
  const excelData = records.map((record, index) => ({
    번호: index + 1,
    날짜: new Date(record.createdAt).toLocaleDateString("ko-KR"),
    시간: new Date(record.createdAt).toLocaleTimeString("ko-KR"),
    항목명: record.itemName,
    카테고리: record.category,
    절약금액: record.amount,
    메모: record.memo || "-",
  }));

  // 총합계 행 추가
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
  excelData.push({
    번호: 0,
    날짜: "",
    시간: "",
    항목명: "총 합계",
    카테고리: "",
    절약금액: totalAmount,
    메모: `총 ${records.length}건`,
  });

  // 워크북 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();

  // 컬럼 너비 설정
  const colWidths = [
    { wch: 8 }, // 번호
    { wch: 12 }, // 날짜
    { wch: 10 }, // 시간
    { wch: 20 }, // 항목명
    { wch: 12 }, // 카테고리
    { wch: 15 }, // 절약금액
    { wch: 30 }, // 메모
  ];
  worksheet["!cols"] = colWidths;

  // 총합계 행 스타일링 (사용하지 않으므로 주석 처리)
  // const lastRowIndex = excelData.length;
  // const totalRowCells = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(col => `${col}${lastRowIndex}`);

  // 워크시트에 추가
  XLSX.utils.book_append_sheet(workbook, worksheet, "절약기록");

  // 파일명 생성
  const defaultFilename = `절약기록_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  const finalFilename = filename || defaultFilename;

  // 파일 다운로드
  XLSX.writeFile(workbook, finalFilename);

  return {
    totalRecords: records.length,
    totalAmount,
    filename: finalFilename,
  };
};

// 기간별 내보내기
export const exportRecordsByPeriod = (
  records: SavingRecord[],
  startDate: Date,
  endDate: Date,
  filename?: string
) => {
  const filteredRecords = records.filter((record) => {
    const recordDate = new Date(record.createdAt);
    return recordDate >= startDate && recordDate <= endDate;
  });

  const periodText = `${startDate.toLocaleDateString(
    "ko-KR"
  )}_${endDate.toLocaleDateString("ko-KR")}`;
  const defaultFilename = `절약기록_${periodText}.xlsx`;

  return exportToExcel(filteredRecords, filename || defaultFilename);
};

// 카테고리별 내보내기
export const exportRecordsByCategory = (
  records: SavingRecord[],
  category: string,
  filename?: string
) => {
  const filteredRecords = records.filter(
    (record) => record.category === category
  );
  const defaultFilename = `절약기록_${category}_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;

  return exportToExcel(filteredRecords, filename || defaultFilename);
};
