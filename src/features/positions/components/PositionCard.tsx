import {
  formatHuDate,
  isExpired,
  toTagName,
  norm,
} from "../utils/positions.utils";
import type { Position, Tag } from "../../../types/api.types";

interface PositionCardProps {
  position: Position;
  logo: string;
  onCompanyClick: (company: any) => void;
  onApply?: (positionId: string | number) => void;
  hideCompanyInfo?: boolean;
}

export default function PositionCard({
  position: p,
  logo,
  onCompanyClick,
  onApply,
  hideCompanyInfo,
}: PositionCardProps) {
  const companyName = norm(p.company?.name) || "Ismeretlen cég";
  const title = norm(p.title) || "Névtelen pozíció";
  const cityText = norm(p.location?.city) || "—";
  const deadlineText = formatHuDate(p.deadline);

  const tags = (Array.isArray(p.tags) ? p.tags : [])
    .map((t: Tag) => norm(toTagName(t)))
    .filter(Boolean);

  const previewTags = tags.slice(0, 6);
  const hiddenCount = tags.length - previewTags.length;

  const expired = isExpired(p.deadline);

  return (
    <article
      key={String(p.id ?? `${companyName}-${title}-${cityText}`)}
      className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
    >
      <div className="p-5 flex-grow">
        {/* felső sor */}
        <div className="flex items-start gap-4">
          {!hideCompanyInfo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const companyData = {
                  ...p.company,
                  id: p.company?.id ?? p.companyId,
                  name: companyName,
                };
                console.log("🖱️ Logo clicked! company data:", companyData);
                onCompanyClick(companyData);
              }}
              className="h-20 w-20 rounded-2xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
              title={`${companyName} információi`}
            >
              <img
                src={logo}
                alt={`${companyName} logó`}
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </button>
          )}

          <div className="min-w-0">
            <div className="text-xs text-slate-500 mb-1">
              {!hideCompanyInfo && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const companyData = {
                        ...p.company,
                        id: p.company?.id ?? p.companyId,
                        name: companyName,
                      };
                      console.log(
                        "🖱️ Company name clicked! company data:",
                        companyData,
                      );
                      onCompanyClick(companyData);
                    }}
                    className="hover:text-blue-600 hover:underline transition cursor-pointer"
                    title={`${companyName} információi`}
                  >
                    {companyName}
                  </button>
                  {" • "}
                </>
              )}
              {cityText}
            </div>

            <h3 className="text-base font-semibold text-slate-900 leading-snug break-words">
              {title}
            </h3>
          </div>
        </div>

        {/* meta chip sor */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
            📍 {cityText}
          </span>

          <span
            className={[
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
              expired ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800",
            ].join(" ")}
          >
            ⏳ Határidő: {deadlineText}
          </span>
        </div>

        {/* tagek */}
        {previewTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previewTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
              >
                {t}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                +{hiddenCount}
              </span>
            )}
          </div>
        )}

        {/* leírás */}
        {norm(p.description) && (
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            {String(p.description).length > 140
              ? String(p.description).slice(0, 140) + "…"
              : String(p.description)}
          </p>
        )}

        {/* alsó meta */}
        <div className="mt-4 space-y-1 text-xs text-slate-600">
          {norm(p.location?.address) && (
            <div>📌 {norm(p.location?.address)}</div>
          )}
          {(norm(p.location?.zipCode) || norm(p.location?.city)) && (
            <div>
              🏷️ {norm(p.location?.zipCode)} {norm(p.location?.city)}
            </div>
          )}
        </div>
      </div>
      {/* CTA */}
      <div className="p-5 pt-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            // Check for external application
            // Use window.dispatchEvent to trigger a custom event that useToast can listen to,
            // OR better, checking if we can use useToast here.
            // Since PositionCard is a component, it can accept a toast function or trigger a global event.
            // But wait, PositionCard is used in many places.
            // Let's use a simpler approach: allow onApply to handle everything if provided,
            // or try to dispatch a custom event for the toast if we want to keep it simple.

            // Actually, PositionCard is pure UI. It shouldn't have side effects like window.open if possible,
            // but currently it does.
            // To show a toast, we need access to the toast context.
            // Let's rely on the parent to handle this if possible?
            // But the requirement is tight.

            // Let's assume we can import a singleton or dispatch an event if useToast isn't available.
            // However, strictly speaking, hooks rules apply. We can't use hooks inside onClick.
            // We should modify the component to receive a showToast prop OR use a custom event.

            // Given the "dumb" component strictness, creating a side effect here is borderline.
            // But for now, let's keep it simple:
            // We will emit a custom event that the layout listens to, OR just console log for now if we can't easily access toast.
            // WAIT! I can just use the standard window.alert? No, that's ugly.
            // I will dispatch a custom event 'show-toast' that our ToastProvider listens to?
            // The project has `useToast`.

            // BETTER PLAN: Remove the internal window.open logic from PositionCard entirely
            // and delegate it to `onApply`. The parent `PositionsPage` already handles it perfectly now!
            // So if I just removing this block, the `onApply` in the parent will trigger,
            // do the check (even if redundant), show the toast, and then redirect.
            // This is much cleaner and follows "Smart Parent, Dumb Child" architecture.

            // BUT wait, does `onApply` handle immediate redirects?
            // In `PositionsPage.tsx`, `handleApply` does exactly that check!
            // So I can safely REMOVE this logic from PositionCard and let the parent handle it.

            // One catch: PositionCard might be used elsewhere (e.g. Landing Page).
            // I need to make sure those parents also handle it or use a default handler.
            // If `onApply` is optional, I might break it if it's not passed.

            // Let's look at Step 403 `PositionCard.tsx`.
            // lines 174-178: explicit check.
            // line 180: if `onApply` exists, call it.

            // If I remove the check, `onApply` is called.
            // In `PositionsPage`, `handleApply` takes the ID, finds the position, checks for external app, and handles it.
            // So for `PositionsPage`, removing this block is CORRECT and DESIRABLE.

            // What about other usages?
            // `CompanyProfilePage` (public) uses it?
            // Let's check `PublicCompanyProfilePage.tsx` line 251 (Step 321):
            // `onApply={(id) => { sessionStorage.setItem... navigate... }}`
            // It navigates to `/positions`. It does NOT handle the redirect logic immediately.
            // So if I remove it from Card, the user clicks Apply on Public Profile -> goes to Positions Page -> Modal opens (or checks redirect).
            // Use case: User is on Public Profile positions list. Clicks Apply.
            // If internal: goes to /positions?id=xyz -> Modal opens.
            // If external: goes to /positions?id=xyz -> then what?
            // `PositionsPage` useEffect (line 70) checks `id` param.
            // It opens `applicationModal.open(position)`.
            // It DOES NOT do the external check in the useEffect!

            // So if I remove the logic from PositionCard, the Public Profile flow for external jobs will be:
            // Click Apply -> Open /positions?id=... -> Open Modal (Internal).
            // This is WRONG for external jobs. They should redirect.

            // So `PublicCompanyProfilePage` also needs to handle the redirect logic if I remove it from Card.
            // OR I keep the logic in Card but make it "smarter" (add toast).
            // But Card can't use hooks.

            // Solution: Add `onExternalApply` prop? Or modify `onApply` signature to receive the full object?
            // Or just accept that PositionCard handles the redirect and use `window.alert` (no) or direct DOM manipulation for toast (ugly).
            // Best: Pass `toast` instance to PositionCard? No, props drilling.

            // Correct approach:
            // 1. Modify `PositionCard` to invoke `onApply` ALWAYS.
            // 2. The parent (`PositionsPage`, `PublicProfilePage`) is responsible for the business logic (check type, redirect or open modal).
            // 3. I already fixed `PositionsPage`.
            // 4. I just need to fix `PublicCompanyProfilePage` to handle the external check too.

            // Let's Verify `PositionsPage` handles it (Step 398): Yes.
            // Let's check `PublicCompanyProfilePage`.

            // Decision: I will REMOVE the side-effect logic from `PositionCard` to strictly follow "Dumb UI" pattern.
            // And I will ensure parents handle the redirection.

            if (onApply && p.id) {
              onApply(p.id);
            }
            return;
          }}
          disabled={expired || !onApply}
          className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {expired ? "Lejárt" : "Jelentkezés"}
        </button>
      </div>
    </article>
  );
}
