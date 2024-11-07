import { TouchableArea } from 'ui/src'
import { InlineWarningCard } from 'uniswap/src/components/InlineWarningCard/InlineWarningCard'
import { WarningSeverity } from 'uniswap/src/components/modals/WarningModal/types'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import {
  TokenProtectionWarning,
  getCardHeaderText,
  getCardSubtitleText,
  getFeeOnTransfer,
  getSeverityFromTokenProtectionWarning,
  getTokenWarningSeverity,
  useTokenWarningCardText,
} from 'uniswap/src/features/tokens/safetyUtils'
import { useTranslation } from 'uniswap/src/i18n'

type TokenWarningCardProps = {
  currencyInfo: Maybe<CurrencyInfo>
  tokenProtectionWarningOverride?: TokenProtectionWarning
  feePercentOverride?: number
  onPress?: () => void
  headingTestId?: string
  descriptionTestId?: string
  hideCtaIcon?: boolean
  checked?: boolean
  setChecked?: (checked: boolean) => void
}

function useTokenWarningOverrides(
  currencyInfo: Maybe<CurrencyInfo>,
  tokenProtectionWarningOverride?: TokenProtectionWarning,
  feePercentOverride?: number,
): { severity: WarningSeverity; heading: string | null; description: string | null } {
  const { t } = useTranslation()
  const { formatPercent } = useLocalizationContext()
  const { heading: headingDefault, description: descriptionDefault } = useTokenWarningCardText(currencyInfo)

  const severity = tokenProtectionWarningOverride
    ? getSeverityFromTokenProtectionWarning(tokenProtectionWarningOverride)
    : getTokenWarningSeverity(currencyInfo)

  const headingOverride = getCardHeaderText({
    t,
    tokenProtectionWarning: tokenProtectionWarningOverride ?? TokenProtectionWarning.None,
  })

  const descriptionOverride = getCardSubtitleText({
    t,
    tokenProtectionWarning: tokenProtectionWarningOverride ?? TokenProtectionWarning.None,
    tokenSymbol: currencyInfo?.currency.symbol,
    feePercent: feePercentOverride ?? getFeeOnTransfer(currencyInfo?.currency),
    formatPercent,
  })

  const heading = tokenProtectionWarningOverride ? headingOverride : headingDefault
  const description = tokenProtectionWarningOverride ? descriptionOverride : descriptionDefault

  return { severity, heading, description }
}

export function TokenWarningCard({
  currencyInfo,
  tokenProtectionWarningOverride,
  feePercentOverride,
  headingTestId,
  descriptionTestId,
  hideCtaIcon,
  checked,
  setChecked,
  onPress,
}: TokenWarningCardProps): JSX.Element | null {
  const { t } = useTranslation()
  const { severity, heading, description } = useTokenWarningOverrides(
    currencyInfo,
    tokenProtectionWarningOverride,
    feePercentOverride,
  )

  if (!currencyInfo || !severity || !description) {
    return null
  }

  return (
    <TouchableArea onPress={onPress}>
      <InlineWarningCard
        hideCtaIcon={hideCtaIcon}
        severity={severity}
        checkboxLabel={setChecked ? t('common.button.understand') : undefined}
        heading={heading ?? undefined}
        description={description}
        headingTestId={headingTestId}
        descriptionTestId={descriptionTestId}
        checked={checked}
        setChecked={setChecked}
        onPressCtaButton={onPress}
      />
    </TouchableArea>
  )
}
