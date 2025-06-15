package com.eren.taxcalculator.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Service katmanındaki tüm public metotlar için pointcut
    @Pointcut("execution(public * com.eren.taxcalculator.service..*.*(..))")
    public void serviceLayerExecution() {}

    // Controller katmanındaki tüm public metotlar için pointcut
    @Pointcut("execution(public * com.eren.taxcalculator.controller..*.*(..))")
    public void controllerLayerExecution() {}

    // Hem service hem de controller katmanlarını kapsayan genel bir pointcut
    @Pointcut("serviceLayerExecution() || controllerLayerExecution()")
    public void applicationExecution() {}

    // Metot çağrılmadan önce loglama
    @Before("applicationExecution()")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("==> Enter: {}.{}() with argument[s] = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs()));
    }

    // Metot başarıyla tamamlandıktan sonra loglama
    @AfterReturning(pointcut = "applicationExecution()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        logger.info("<== Exit: {}.{}() with result = {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                result);
    }

    // Metot exception fırlattığında loglama
    @AfterThrowing(pointcut = "applicationExecution()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
        logger.error("!!! Exception in {}.{}() with cause = '{}' and exception = '{}'",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                exception.getCause() != null ? exception.getCause() : "NULL",
                exception.getMessage(),
                exception); // Exception'ın stack trace'ini de loglamak için
    }

    // Metotların çalışma süresini ölçmek için @Around (isteğe bağlı)
    @Around("applicationExecution()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        logger.debug(">>> Around: Entering {}.{}()", joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName());

        Object result;
        try {
            result = joinPoint.proceed(); // Hedef metodu çalıştır
        } catch (Throwable throwable) {
            logger.error("!!! Around: Exception in {}.{}()", joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName(), throwable);
            throw throwable; // Exception'ı tekrar fırlat
        } finally {
            stopWatch.stop();
            logger.debug("<<< Around: Exiting {}.{}(); Execution time: {} ms",
                    joinPoint.getSignature().getDeclaringTypeName(),
                    joinPoint.getSignature().getName(),
                    stopWatch.getTotalTimeMillis());
        }
        return result;
    }

    @Pointcut("execution(* com.eren.taxcalculator.controller.*.*(..))")
    public void controllerMethods() {}

    @Around("controllerMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        logger.info("Method {} called with arguments: {}",
                joinPoint.getSignature().getName(),
                Arrays.toString(joinPoint.getArgs()));

        try {
            Object result = joinPoint.proceed();
            stopWatch.stop();
            logger.info("Method {} executed in {} ms",
                    joinPoint.getSignature().getName(),
                    stopWatch.getTotalTimeMillis());
            return result;
        } catch (Exception e) {
            stopWatch.stop();
            logger.error("Method {} failed after {} ms with error: {}",
                    joinPoint.getSignature().getName(),
                    stopWatch.getTotalTimeMillis(),
                    e.getMessage());
            throw e;
        }
    }
}