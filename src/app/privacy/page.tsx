import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침"
};

export default function PrivacyPage() {
  return (
    <section className="container-narrow py-10">
      <h1 className="text-3xl font-bold">개인정보처리방침</h1>
      <div className="prose-brand mt-6">
        <p>쎄리는 로딩중은 문의 응대, 강의 안내, 뉴스레터 발송을 위해 사용자가 제출한 이름과 이메일, 문의 내용을 수집할 수 있습니다.</p>
        <p>수집된 정보는 목적 달성 후 지체 없이 삭제하며, 법령에 따른 보관 의무가 있는 경우 해당 기간 동안 보관합니다.</p>
        <p>문의: hello@seriisloading.com</p>
      </div>
    </section>
  );
}
